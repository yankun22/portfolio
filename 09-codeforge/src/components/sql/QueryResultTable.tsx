import React, { useState } from 'react';
import type { QueryExecutionResult } from '../../types/sql';
import { Download, FileText, Check } from 'lucide-react';
import { downloadFile } from '../../services/storageService';

interface QueryResultTableProps {
  result: QueryExecutionResult;
}

export const QueryResultTable: React.FC<QueryResultTableProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (result.error) {
    return (
      <div
        style={{
          padding: '16px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-lg)',
          color: '#f43f5e',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem'
        }}
      >
        <strong>SQLite Error:</strong> {result.error}
      </div>
    );
  }

  if (result.columns.length === 0) {
    return (
      <div
        style={{
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-lg)',
          color: '#10b981',
          fontSize: '0.8125rem',
          fontWeight: 600
        }}
      >
        Statement executed successfully in {result.executionTimeMs} ms. {result.rowsAffected !== undefined ? `(${result.rowsAffected} rows affected)` : ''}
      </div>
    );
  }

  const handleExportCsv = () => {
    const headerRow = result.columns.join(',');
    const bodyRows = result.values.map((row) =>
      row.map((val) => (val === null ? '' : `"${String(val).replace(/"/g, '""')}"`)).join(',')
    );
    const csvContent = [headerRow, ...bodyRows].join('\n');
    downloadFile(csvContent, `query_result_${Date.now()}.csv`, 'text/csv');
  };

  const handleExportMarkdown = () => {
    const headerRow = `| ${result.columns.join(' | ')} |`;
    const separatorRow = `| ${result.columns.map(() => '---').join(' | ')} |`;
    const bodyRows = result.values.map(
      (row) => `| ${row.map((val) => (val === null ? 'NULL' : String(val))).join(' | ')} |`
    );
    const md = [headerRow, separatorRow, ...bodyRows].join('\n');
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Table Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          {result.values.length} rows returned in <strong>{result.executionTimeMs} ms</strong>
        </span>

        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={handleExportMarkdown}>
            {copied ? <Check size={11} color="#10b981" /> : <FileText size={11} />}
            <span>{copied ? 'Copied MD' : 'Copy Markdown'}</span>
          </button>
          <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.7rem' }} onClick={handleExportCsv}>
            <Download size={11} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SQL Results Grid */}
      <div
        style={{
          maxHeight: 340,
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-input)'
        }}
      >
        <table className="sql-results-table">
          <thead>
            <tr>
              <th style={{ width: 45, color: 'var(--text-dim)' }}>#</th>
              {result.columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.values.map((row, rIdx) => (
              <tr key={rIdx}>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{rIdx + 1}</td>
                {row.map((val, cIdx) => (
                  <td key={cIdx}>
                    {val === null ? (
                      <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>NULL</span>
                    ) : (
                      String(val)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
