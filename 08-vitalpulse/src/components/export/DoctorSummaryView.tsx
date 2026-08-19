import React from 'react';
import type { PatientHealthRecord } from '../../types/patient';
import { PrintReportView } from './PrintReportView';
import { Download, Printer } from 'lucide-react';
import { exportClinicalReportPDF } from '../../services/clinicalPdfService';

interface DoctorSummaryViewProps {
  record: PatientHealthRecord;
}

export const DoctorSummaryView: React.FC<DoctorSummaryViewProps> = ({ record }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportClinicalReportPDF(record);
  };

  return (
    <div className="export-scroll-container">
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Doctor Clinical Summary &amp; Export
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            One-click standardized clinical summary for physician appointments, cardiology consults, and EHR archival
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Sheet</span>
          </button>

          <button className="btn-primary" onClick={handleDownloadPDF}>
            <Download size={15} />
            <span>Download Clinical PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <PrintReportView record={record} />
    </div>
  );
};
