import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { AppStateSnapshot, PatientHealthRecord } from '../../types/patient';
import { exportPatientEHRJson, downloadJsonFile } from '../../services/storageService';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EHRBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  appState: AppStateSnapshot;
  onImportRecord: (importedRecord: PatientHealthRecord) => void;
}

export const EHRBackupModal: React.FC<EHRBackupModalProps> = ({
  isOpen,
  onClose,
  patientId,
  appState,
  onImportRecord
}) => {
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const activePatient = appState.patients.find((p) => p.id === patientId);

  const handleDownload = () => {
    const jsonStr = exportPatientEHRJson(patientId, appState);
    const filename = `VitalPulse_EHR_${activePatient?.fullName.replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().split('T')[0]}.json`;
    downloadJsonFile(jsonStr, filename);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(importText);
      if (!parsed.patient || !parsed.record) {
        throw new Error('Invalid EHR bundle format. Must contain "patient" and "record" fields.');
      }
      onImportRecord(parsed.record);
      setImportSuccess(true);
      setImportText('');
      confetti({ particleCount: 50, spread: 60 });
    } catch (err: unknown) {
      setImportError((err as Error).message || 'Failed to parse JSON EHR payload.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Electronic Health Record (EHR) Data Management" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Export Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Export Clinical JSON Bundle
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Download full 30-day vitals, medications, adherence logs, and risk baseline.
            </div>
          </div>

          <button className="btn-primary" onClick={handleDownload}>
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>

        {/* Import Form */}
        <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Import EHR Patient Data
          </h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Paste a valid VitalPulse JSON bundle to restore or sync biometric telemetry.
          </div>

          <textarea
            className="form-textarea"
            rows={5}
            placeholder='Paste JSON bundle here: { "patient": { ... }, "record": { ... } }'
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
          />

          {importError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f43f5e', fontSize: '0.75rem' }}>
              <AlertCircle size={14} />
              <span>{importError}</span>
            </div>
          )}

          {importSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: '0.75rem' }}>
              <Check size={14} />
              <span>EHR record successfully imported and synchronized!</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn-primary" disabled={!importText.trim()}>
              <Upload size={14} />
              <span>Import Record</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
