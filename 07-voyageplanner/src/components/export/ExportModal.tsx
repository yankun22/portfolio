import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Trip } from '../../types/itinerary';
import { type AppStateSnapshot, exportTripToJson, downloadJsonFile } from '../../services/storageService';
import { Download, Upload, Copy, Check, FileJson } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  appState: AppStateSnapshot;
  onImportTrip: (importedData: any) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  trip,
  appState,
  onImportTrip
}) => {
  const [copied, setCopied] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const jsonBundle = exportTripToJson(trip.id, appState);

  const handleDownload = () => {
    downloadJsonFile(
      jsonBundle,
      `${trip.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-voyageplanner.json`
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonBundle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.trip || !parsed.trip.id) {
          setImportError('Invalid VoyagePlanner trip bundle format.');
          return;
        }
        onImportTrip(parsed);
        setImportError(null);
        onClose();
      } catch {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.trip || !parsed.trip.id) {
        setImportError('Invalid VoyagePlanner trip bundle format.');
        return;
      }
      onImportTrip(parsed);
      setImportError(null);
      onClose();
    } catch {
      setImportError('Invalid JSON syntax.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Backup, Export & Import Itinerary" maxWidth="580px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Download size={16} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
              Export "{trip.title}"
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Export this complete itinerary including all scheduled places, waypoints, companion shares, expenses, and packing checklists as a portable JSON file.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn-primary" onClick={handleDownload}>
              <FileJson size={14} />
              <span>Download JSON Bundle</span>
            </button>
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Upload size={16} color="#10b981" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
              Import Itinerary JSON
            </h4>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Load a previously exported trip bundle or share itineraries between travel companions.
          </p>

          <div style={{ marginTop: 8 }}>
            <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <Upload size={14} />
              <span>Upload .json File</span>
              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label className="form-label">Or Paste JSON Data:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Paste raw JSON trip data here..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            {jsonText.trim() && (
              <button
                type="button"
                className="btn-primary"
                style={{ marginTop: 8, fontSize: '0.75rem', padding: '6px 12px' }}
                onClick={handleTextImport}
              >
                Import Pasted Data
              </button>
            )}
          </div>

          {importError && (
            <div style={{ color: '#fb7185', fontSize: '0.75rem', marginTop: 8 }}>
              ⚠️ {importError}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
