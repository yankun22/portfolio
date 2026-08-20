import React from 'react';
import type { TableSchema } from '../../types/sql';
import { SAMPLE_DATABASES } from '../../data/sampleSqlDb';
import { Database, Table, Key, RotateCcw } from 'lucide-react';

interface SchemaBrowserProps {
  tables: TableSchema[];
  onSelectTable: (tableName: string) => void;
  onLoadDatabasePreset: (presetId: string) => void;
  onResetDb: () => void;
}

export const SchemaBrowser: React.FC<SchemaBrowserProps> = ({
  tables,
  onSelectTable,
  onLoadDatabasePreset,
  onResetDb
}) => {
  return (
    <div className="schema-sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Database size={16} color="#06b6d4" />
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Schema Inspector
          </h3>
        </div>

        <button
          className="btn-icon"
          style={{ width: 24, height: 24 }}
          onClick={onResetDb}
          title="Reset / Re-seed In-Memory Database"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Preset Databases Dropdown */}
      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.72rem' }}>Preset Databases</label>
        <select
          className="form-select"
          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          onChange={(e) => onLoadDatabasePreset(e.target.value)}
          defaultValue={SAMPLE_DATABASES[0].id}
        >
          {SAMPLE_DATABASES.map((db) => (
            <option key={db.id} value={db.id}>
              {db.icon} {db.name} ({db.tablesCount} tables)
            </option>
          ))}
        </select>
      </div>

      {/* Tables Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Active Tables ({tables.length})
        </span>

        {tables.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontStyle: 'italic' }}>
            No tables created yet. Run CREATE TABLE statements.
          </div>
        ) : (
          tables.map((tbl) => (
            <div
              key={tbl.name}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => onSelectTable(tbl.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Query this table"
                >
                  <Table size={13} color="#38bdf8" />
                  <span>{tbl.name}</span>
                </button>

                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {tbl.rowCount} rows
                </span>
              </div>

              {/* Columns list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 16 }}>
                {tbl.columns.map((col) => (
                  <div
                    key={col.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.68rem',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {col.primaryKey && <Key size={10} color="#f59e0b" />}
                      {col.name}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.62rem' }}>
                      {col.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
