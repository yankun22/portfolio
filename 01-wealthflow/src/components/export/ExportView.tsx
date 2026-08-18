import React, { useRef } from 'react';
import {
  FileDown,
  FileText,
  Table,
  Database,
  Upload,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

export const ExportView: React.FC = () => {
  const {
    exportPdf,
    exportHoldingsCsv,
    exportMonteCarloCsv,
    exportJsonBackup,
    importJsonBackup,
    assets,
    mcParams,
  } = useWealth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          importJsonBackup(content);
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="card-title">
              <FileDown size={22} color="#10b981" />
              WealthFlow™ Institutional Export & Intelligence Suite
            </h2>
            <p className="card-subtitle">
              Generate audit-ready multi-page PDF dossiers, raw spreadsheet data, and encrypted profile backups
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">
              <ShieldCheck size={12} />
              100% Client-Side Private
            </span>
          </div>
        </div>
      </Card>

      {/* Export Options Grid */}
      <div className="grid-2">
        {/* PDF Intelligence Report */}
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Multi-Page Financial Health PDF Report
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comprehensive 3-page branded institutional executive dossier
              </p>
            </div>
          </div>

          {/* Included Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '18px 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span>
                <strong>Page 1:</strong> Executive Wealth Scorecard & Asset Class Allocation
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span>
                <strong>Page 2:</strong> Itemized Holdings Ledger with Cost Basis & Passive Yields
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={14} color="#10b981" />
              <span>
                <strong>Page 3:</strong> FIRE Readiness & Monte Carlo 500-Path Percentile Trajectory
              </span>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={exportPdf}>
            <Download size={16} />
            Download Formatted PDF Report
          </button>
        </Card>

        {/* CSV Data Suite */}
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                color: '#fff',
              }}
            >
              <Table size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Spreadsheet CSV Data Export
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Raw tabular data for Excel, Google Sheets, or custom Python analytics
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
            <button className="btn btn-cyan" style={{ width: '100%', padding: '11px' }} onClick={exportHoldingsCsv}>
              <Download size={16} />
              Export Portfolio Holdings ({assets.length} items) (.CSV)
            </button>

            <button className="btn btn-secondary" style={{ width: '100%', padding: '11px' }} onClick={exportMonteCarloCsv}>
              <Download size={16} />
              Export Monte Carlo Yearly Projections ({mcParams.timeHorizonYears} Yrs) (.CSV)
            </button>
          </div>
        </Card>
      </div>

      {/* Profile Backup & Restore */}
      <Card>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Database size={20} color="#8b5cf6" />
              Complete Profile Backup & Restore
            </h3>
            <p className="card-subtitle">
              Export and restore all portfolio assets, simulation models, and FIRE parameters as a JSON file
            </p>
          </div>
        </div>

        <div className="grid-2">
          <div
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Export Full Backup
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Download an exact snapshot of your wealth data for offline storage or migrating to another browser.
              </p>
            </div>
            <button className="btn btn-violet" onClick={exportJsonBackup}>
              <Download size={16} />
              Download Profile JSON (.JSON)
            </button>
          </div>

          <div
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
            }}
          >
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Restore From Backup
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Load an existing WealthFlow JSON backup file to instantly restore your assets and simulations.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                Upload & Restore Backup (.JSON)
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
