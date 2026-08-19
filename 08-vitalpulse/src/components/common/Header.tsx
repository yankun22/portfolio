import React from 'react';
import {
  Activity,
  Pill,
  Apple,
  ShieldAlert,
  FileText,
  Plus,
  Moon,
  Sun,
  Download,
  Upload,
  ChevronDown
} from 'lucide-react';
import type { PatientProfile } from '../../types/patient';

export type ActiveTab = 'telemetry' | 'medications' | 'nutrition' | 'risk' | 'summary';

interface HeaderProps {
  patients: PatientProfile[];
  activePatient: PatientProfile;
  onSelectPatient: (patientId: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLogVitalModal: () => void;
  onOpenEHRModal: () => void;
  onExportPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  activePatient,
  onSelectPatient,
  activeTab,
  onTabChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenLogVitalModal,
  onOpenEHRModal,
  onExportPDF
}) => {
  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Activity size={22} />
          </div>
          <div>
            <div className="brand-title">VitalPulse</div>
            <div className="brand-subtitle">Clinical Analytics Studio</div>
          </div>

          <div className="patient-picker-wrapper">
            <select
              className="patient-picker-select"
              value={activePatient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              title="Switch active patient profile"
            >
              <optgroup label="Active Patients">
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatarEmoji} {p.fullName} ({p.age}y, MRN: {p.mrn})
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 10, pointerEvents: 'none', opacity: 0.6 }} />
          </div>
        </div>

        {/* Desktop View Navigation Tabs */}
        <nav className="view-tabs">
          <button
            className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => onTabChange('telemetry')}
          >
            <Activity size={15} />
            <span>Telemetry</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => onTabChange('medications')}
          >
            <Pill size={15} />
            <span>Medications</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => onTabChange('nutrition')}
          >
            <Apple size={15} />
            <span>Nutrition</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => onTabChange('risk')}
          >
            <ShieldAlert size={15} />
            <span>Risk Calculator</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => onTabChange('summary')}
          >
            <FileText size={15} />
            <span>Doctor Summary</span>
          </button>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-primary" onClick={onOpenLogVitalModal}>
            <Plus size={15} />
            <span>Log Vital</span>
          </button>

          <button className="btn-secondary" onClick={onExportPDF} title="Export Clinical PDF Report">
            <Download size={14} />
            <span>PDF</span>
          </button>

          <button className="btn-icon" onClick={onOpenEHRModal} title="EHR JSON Backup & Restore">
            <Upload size={16} />
          </button>

          <button
            className="btn-icon"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-bottom-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
          onClick={() => onTabChange('telemetry')}
        >
          <Activity size={18} />
          <span>Vitals</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => onTabChange('medications')}
        >
          <Pill size={18} />
          <span>Meds</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => onTabChange('nutrition')}
        >
          <Apple size={18} />
          <span>Diet</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'risk' ? 'active' : ''}`}
          onClick={() => onTabChange('risk')}
        >
          <ShieldAlert size={18} />
          <span>Risk</span>
        </button>

        <button
          className={`mobile-bottom-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => onTabChange('summary')}
        >
          <FileText size={18} />
          <span>Report</span>
        </button>
      </nav>
    </>
  );
};
