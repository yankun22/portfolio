import React, { useState, useRef } from 'react';
import { useWiki } from '../context/WikiContext';
import {
  exportVaultAsZip,
  exportVaultAsJson,
  importVaultFromZip,
  importVaultFromJson,
} from '../utils/vaultManager';
import {
  FolderArchive,
  Download,
  Upload,
  FileJson,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VaultExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultExportModal: React.FC<VaultExportModalProps> = ({ isOpen, onClose }) => {
  const { notes, importNotes } = useWiki();
  const [vaultName, setVaultName] = useState<string>('nexus-knowledge-vault');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportZip = async () => {
    setIsLoading(true);
    try {
      await exportVaultAsZip(notes, vaultName);
      confetti({ particleCount: 40, spread: 50 });
    } catch (err: any) {
      alert('Failed to export ZIP: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportJson = () => {
    exportVaultAsJson(notes, vaultName);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setImportStatus(null);
    try {
      let imported: any[] = [];
      if (file.name.endsWith('.zip')) {
        imported = await importVaultFromZip(file);
      } else if (file.name.endsWith('.json')) {
        imported = await importVaultFromJson(file);
      } else {
        throw new Error('Unsupported file format. Please upload a .zip or .json file.');
      }

      importNotes(imported, 'merge');
      setImportStatus(`Successfully imported ${imported.length} notes!`);
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: any) {
      setImportStatus(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '580px',
          maxWidth: '92vw',
          background: '#0c121e',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              <FolderArchive size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Vault Portability & Storage</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Export or import your complete knowledge graph with zero vendor lock-in.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Vault Name Input */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            VAULT ARCHIVE NAME
          </label>
          <input
            type="text"
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Export Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* ZIP Option */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(139, 92, 246, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FileCode size={16} color="#8b5cf6" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Export as ZIP Archive</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Packages all {notes.length} notes as standalone <code>.md</code> markdown files.
              </p>
            </div>

            <button
              onClick={handleExportZip}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              <Download size={14} />
              <span>Download .ZIP</span>
            </button>
          </div>

          {/* JSON Option */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(6, 182, 212, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FileJson size={16} color="#06b6d4" />
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>Export as JSON State</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Full structured backup preserving timestamps, tags, and graph state.
              </p>
            </div>

            <button
              onClick={handleExportJson}
              disabled={isLoading}
              className="btn btn-cyan btn-sm"
              style={{ width: '100%' }}
            >
              <Download size={14} />
              <span>Download .JSON</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            IMPORT EXISTING VAULT
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,.json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="btn"
            style={{ width: '100%', padding: '12px', borderStyle: 'dashed', borderColor: 'var(--border-medium)' }}
          >
            <Upload size={16} color="#c084fc" />
            <span>Upload .ZIP Archive or .JSON Backup</span>
          </button>

          {importStatus && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: importStatus.startsWith('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: importStatus.startsWith('Error') ? '#f87171' : '#34d399',
              }}
            >
              {importStatus.startsWith('Error') ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
