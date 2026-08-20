import type { TableSchema, ColumnSchema, QueryExecutionResult } from '../types/sql';

// Type definitions for sql.js database interface
interface SqlJsQueryResult {
  columns: string[];
  values: (string | number | boolean | null)[][];
}

interface SqlJsDatabase {
  exec(sql: string): SqlJsQueryResult[];
  getRowsModified?: () => number;
}

let dbInstance: SqlJsDatabase | null = null;
let sqlJsReadyPromise: Promise<SqlJsDatabase> | null = null;

// Dynamically load sql-wasm.js script into document head
function loadSqlScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  // If already loaded on window
  if ((window as unknown as { initSqlJs?: unknown }).initSqlJs) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById('sql-js-script');
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve());
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'sql-js-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load sql.js script'));
    document.head.appendChild(script);
  });
}

/**
 * Pure In-Memory Fallback SQL Engine in case WASM fails to fetch
 */
class FallbackMemoryDatabase implements SqlJsDatabase {
  private tables: Map<string, { columns: ColumnSchema[]; rows: Record<string, unknown>[] }> = new Map();

  exec(sql: string): SqlJsQueryResult[] {
    const trimmed = sql.trim();
    if (!trimmed) return [];

    const statements = splitSqlStatements(trimmed);
    const results: SqlJsQueryResult[] = [];

    for (const stmt of statements) {
      const s = stmt.trim();
      if (!s) continue;

      if (/^CREATE\s+TABLE/i.test(s)) {
        this.handleCreateTable(s);
      } else if (/^INSERT\s+INTO/i.test(s)) {
        this.handleInsert(s);
      } else if (/^SELECT/i.test(s)) {
        const res = this.handleSelect(s);
        if (res) results.push(res);
      } else if (/^DROP\s+TABLE/i.test(s)) {
        this.handleDropTable(s);
      }
    }

    return results;
  }

  private handleCreateTable(sql: string) {
    const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([a-zA-Z0-9_]+)["`]?\s*\(([\s\S]+)\)/i);
    if (!match) return;

    const tableName = match[1];
    const columnDefs = match[2].split(',').map((c) => c.trim());
    const columns: ColumnSchema[] = [];

    for (const def of columnDefs) {
      if (/^(FOREIGN|PRIMARY|UNIQUE|CHECK)/i.test(def)) continue;
      const parts = def.split(/\s+/);
      const colName = parts[0].replace(/["`]/g, '');
      const colType = parts[1] || 'TEXT';
      columns.push({
        name: colName,
        type: colType.toUpperCase(),
        notNull: /NOT\s+NULL/i.test(def),
        primaryKey: /PRIMARY\s+KEY/i.test(def)
      });
    }

    this.tables.set(tableName, { columns, rows: [] });
  }

  private handleInsert(sql: string) {
    const match = sql.match(/INSERT\s+INTO\s+["`]?([a-zA-Z0-9_]+)["`]?\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+)/i);
    if (!match) return;

    const tableName = match[1];
    const table = this.tables.get(tableName);
    if (!table) return;

    // Parse tuples: (1, 'Alice', ...), (2, 'Bob', ...)
    const valuesPart = match[3];
    const tupleRegex = /\(([^)]+)\)/g;
    let tupleMatch: RegExpExecArray | null;

    while ((tupleMatch = tupleRegex.exec(valuesPart)) !== null) {
      const rawVals = tupleMatch[1].split(',').map((v) => {
        const t = v.trim();
        if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
        if (t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
        if (t.toLowerCase() === 'null') return null;
        if (!isNaN(Number(t))) return Number(t);
        return t;
      });

      const rowObj: Record<string, unknown> = {};
      table.columns.forEach((col, idx) => {
        rowObj[col.name] = rawVals[idx] !== undefined ? rawVals[idx] : null;
      });
      table.rows.push(rowObj);
    }
  }

  private handleSelect(sql: string): SqlJsQueryResult | null {
    const fromMatch = sql.match(/FROM\s+["`]?([a-zA-Z0-9_]+)["`]?/i);
    if (!fromMatch) {
      return { columns: ['result'], values: [[1]] };
    }

    const tableName = fromMatch[1];
    const table = this.tables.get(tableName);
    if (!table) {
      return { columns: [], values: [] };
    }

    const cols = table.columns.map((c) => c.name);
    const rows = table.rows.map((r) => cols.map((c) => (r[c] as string | number | boolean | null) ?? null));

    return {
      columns: cols,
      values: rows
    };
  }

  private handleDropTable(sql: string) {
    const match = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?["`]?([a-zA-Z0-9_]+)["`]?/i);
    if (match) {
      this.tables.delete(match[1]);
    }
  }

  getRowsModified() {
    return 1;
  }
}

/**
 * Initializes and returns SQLite Database instance
 */
export async function getSqlDatabase(): Promise<SqlJsDatabase> {
  if (dbInstance) return dbInstance;

  if (!sqlJsReadyPromise) {
    sqlJsReadyPromise = (async () => {
      try {
        await loadSqlScript();

        type InitFn = (cfg: { locateFile: (file: string) => string }) => Promise<{ Database: new () => SqlJsDatabase }>;
        const initFn = (window as unknown as { initSqlJs?: InitFn }).initSqlJs;

        if (typeof initFn === 'function') {
          const SQL = await initFn({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
          });
          dbInstance = new SQL.Database();
          return dbInstance;
        }
      } catch {
        // Fallback to pure in-memory simulator
      }

      dbInstance = new FallbackMemoryDatabase();
      return dbInstance;
    })();
  }

  return sqlJsReadyPromise;
}

/**
 * Executes a single or multi-statement SQL query against the SQLite in-memory database
 */
export async function executeSqlQuery(sql: string): Promise<QueryExecutionResult[]> {
  const trimmed = sql.trim();
  if (!trimmed) {
    return [];
  }

  const db = await getSqlDatabase();
  const results: QueryExecutionResult[] = [];

  const statements = splitSqlStatements(trimmed);

  for (const stmt of statements) {
    if (!stmt.trim()) continue;

    const start = performance.now();
    try {
      const queryRes = db.exec(stmt);
      const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));

      if (queryRes.length === 0) {
        results.push({
          statement: stmt,
          columns: [],
          values: [],
          rowsAffected: db.getRowsModified ? db.getRowsModified() : undefined,
          executionTimeMs,
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        for (const res of queryRes) {
          results.push({
            statement: stmt,
            columns: res.columns,
            values: res.values as (string | number | boolean | null)[][],
            rowsAffected: res.values.length,
            executionTimeMs,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }
    } catch (err: unknown) {
      const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));
      results.push({
        statement: stmt,
        columns: [],
        values: [],
        executionTimeMs,
        error: (err as Error).message || 'SQL execution error.',
        timestamp: new Date().toLocaleTimeString()
      });
    }
  }

  return results;
}

/**
 * Introspects tables, columns, primary keys, and row counts from SQLite
 */
export async function getDatabaseSchema(): Promise<TableSchema[]> {
  const db = await getSqlDatabase();
  const tables: TableSchema[] = [];

  try {
    const tableRes = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );

    if (tableRes.length > 0 && tableRes[0].values) {
      for (const row of tableRes[0].values) {
        const tableName = String(row[0]);
        const cols: ColumnSchema[] = [];

        // Fetch PRAGMA table_info
        try {
          const pragmaRes = db.exec(`PRAGMA table_info("${tableName}");`);
          if (pragmaRes.length > 0 && pragmaRes[0].values) {
            for (const colRow of pragmaRes[0].values) {
              cols.push({
                name: String(colRow[1]),
                type: String(colRow[2] || 'ANY'),
                notNull: Number(colRow[3]) === 1,
                defaultValue: colRow[4] !== null ? String(colRow[4]) : null,
                primaryKey: Number(colRow[5]) === 1
              });
            }
          }
        } catch {}

        let count = 0;
        try {
          const countRes = db.exec(`SELECT COUNT(*) FROM "${tableName}";`);
          if (countRes.length > 0 && countRes[0].values && countRes[0].values[0]) {
            count = Number(countRes[0].values[0][0]) || 0;
          }
        } catch {}

        tables.push({
          name: tableName,
          columns: cols,
          rowCount: count
        });
      }
    }
  } catch {}

  return tables;
}

/**
 * Resets or re-seeds the in-memory SQLite database
 */
export async function resetDatabaseWithSeed(seedSql: string): Promise<void> {
  const db = await getSqlDatabase();

  try {
    const tableRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    if (tableRes.length > 0 && tableRes[0].values) {
      for (const row of tableRes[0].values) {
        db.exec(`DROP TABLE IF EXISTS "${row[0]}";`);
      }
    }
  } catch {}

  if (seedSql.trim()) {
    db.exec(seedSql);
  }
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inString = false;
  let quoteChar = '';

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    if (!inString && (char === "'" || char === '"' || char === '`')) {
      inString = true;
      quoteChar = char;
      current += char;
    } else if (inString && char === quoteChar) {
      if (sql[i + 1] === quoteChar) {
        current += char + quoteChar;
        i++;
      } else {
        inString = false;
        current += char;
      }
    } else if (!inString && char === ';') {
      if (current.trim()) {
        statements.push(current.trim());
      }
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    statements.push(current.trim());
  }

  return statements;
}
