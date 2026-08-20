export interface ColumnSchema {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
  defaultValue?: string | null;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount: number;
}

export interface QueryExecutionResult {
  statement: string;
  columns: string[];
  values: (string | number | boolean | null)[][];
  rowsAffected?: number;
  executionTimeMs: number;
  error?: string;
  timestamp: string;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  success: boolean;
  executionTimeMs: number;
  rowCount?: number;
}

export interface SampleDatabasePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  tablesCount: number;
  seedSql: string;
  starterQuery: string;
}
