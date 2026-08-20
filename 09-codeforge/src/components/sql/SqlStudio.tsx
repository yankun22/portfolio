import React, { useState, useEffect } from 'react';
import type { TableSchema, QueryExecutionResult } from '../../types/sql';
import { SAMPLE_DATABASES } from '../../data/sampleSqlDb';
import {
  executeSqlQuery,
  getDatabaseSchema,
  resetDatabaseWithSeed
} from '../../services/sqlService';
import { SchemaBrowser } from './SchemaBrowser';
import { QueryResultTable } from './QueryResultTable';
import { BenchmarkMeter } from './BenchmarkMeter';
import { Play, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SqlStudioProps {
  initialQuery?: string;
}

export const SqlStudio: React.FC<SqlStudioProps> = ({
  initialQuery = SAMPLE_DATABASES[0].starterQuery
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [results, setResults] = useState<QueryExecutionResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDbPreset, setSelectedDbPreset] = useState(SAMPLE_DATABASES[0].id);

  // Initialize with the default database seed
  useEffect(() => {
    async function initDb() {
      await resetDatabaseWithSeed(SAMPLE_DATABASES[0].seedSql);
      const schema = await getDatabaseSchema();
      setTables(schema);
      // Run initial query
      const initialRes = await executeSqlQuery(SAMPLE_DATABASES[0].starterQuery);
      setResults(initialRes);
    }
    initDb();
  }, []);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsRunning(true);
    try {
      const res = await executeSqlQuery(query);
      setResults(res);

      // Refresh schema after query (e.g. if table created/dropped/inserted)
      const schema = await getDatabaseSchema();
      setTables(schema);

      if (res.some((r) => !r.error && r.columns.length > 0)) {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadDbPreset = async (presetId: string) => {
    setSelectedDbPreset(presetId);
    const dbPreset = SAMPLE_DATABASES.find((d) => d.id === presetId);
    if (dbPreset) {
      await resetDatabaseWithSeed(dbPreset.seedSql);
      const schema = await getDatabaseSchema();
      setTables(schema);
      setQuery(dbPreset.starterQuery);
      const res = await executeSqlQuery(dbPreset.starterQuery);
      setResults(res);
    }
  };

  const handleResetDb = async () => {
    const dbPreset = SAMPLE_DATABASES.find((d) => d.id === selectedDbPreset) || SAMPLE_DATABASES[0];
    await resetDatabaseWithSeed(dbPreset.seedSql);
    const schema = await getDatabaseSchema();
    setTables(schema);
    const res = await executeSqlQuery(query);
    setResults(res);
  };

  const handleSelectTable = (tableName: string) => {
    const q = `SELECT * FROM "${tableName}" LIMIT 20;`;
    setQuery(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  const latestResult = results[results.length - 1];

  return (
    <div className="sql-studio-container">
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            In-Browser SQLite Studio
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real-time in-memory relational database powered by SQLite WebAssembly
          </div>
        </div>

        {latestResult && !latestResult.error && (
          <BenchmarkMeter
            executionTimeMs={latestResult.executionTimeMs}
            rowCount={latestResult.values.length}
          />
        )}
      </div>

      {/* Main Grid: Schema Sidebar + Query Workspace */}
      <div className="sql-layout-grid">
        {/* Left: Schema Browser */}
        <SchemaBrowser
          tables={tables}
          onSelectTable={handleSelectTable}
          onLoadDatabasePreset={handleLoadDbPreset}
          onResetDb={handleResetDb}
        />

        {/* Right: SQL Editor + Query Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Query Editor Card */}
          <div className="sql-editor-card">
            <div
              style={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                <Terminal size={14} color="#06b6d4" />
                <span>SQL Query Editor</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ctrl + Enter to run</span>
                <button
                  className="btn-primary"
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  onClick={handleRunQuery}
                  disabled={isRunning}
                >
                  <Play size={12} />
                  <span>{isRunning ? 'Running...' : 'Execute SQL'}</span>
                </button>
              </div>
            </div>

            <textarea
              className="code-textarea"
              style={{ minHeight: 140, maxHeight: 220 }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write SQL statements here... e.g. SELECT * FROM users;"
              spellCheck={false}
            />
          </div>

          {/* Query Results */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Query Execution Results
            </h3>

            {results.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', padding: '20px 0', textAlign: 'center' }}>
                Run a query above to inspect tabular outputs.
              </div>
            ) : (
              results.map((res, idx) => <QueryResultTable key={idx} result={res} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
