import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PatientHealthRecord } from '../types/patient';
import { computeBiometricAggregateStats } from './telemetryService';
import { calculateASCVDRisk, calculateMetabolicRisk } from './clinicalRiskService';

export function exportClinicalReportPDF(record: PatientHealthRecord): void {
  const { patient, bloodPressure, heartRate, glucose, sleep, medications, medicationLogs } = record;
  const stats = computeBiometricAggregateStats(bloodPressure, heartRate, glucose, sleep, '30d');
  const ascvd = calculateASCVDRisk(patient.riskBaseline.ascvd);
  const metabolic = calculateMetabolicRisk(patient.riskBaseline.metabolic, patient.gender);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep Slate Navy
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('VITALPULSE CLINICAL HEALTH SUMMARY', 14, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Patient: ${patient.fullName} (Age ${patient.age}, ${patient.gender.toUpperCase()}) | MRN: ${patient.mrn}`, 14, 24);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Primary MD: ${patient.primaryPhysician.name}`, 14, 32);

  let currentY = 50;

  // Demographics & Primary Diagnoses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Patient Demographics & Diagnoses', 14, currentY);
  currentY += 6;

  const dxList = patient.diagnoses.map(d => `${d.name} (${d.code})`).join(', ');
  const allergyList = patient.allergies.length > 0
    ? patient.allergies.map(a => `${a.allergen} [${a.severity}]`).join(', ')
    : 'No Known Drug Allergies (NKDA)';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Active Diagnoses: ${dxList}`, 14, currentY, { maxWidth: pageWidth - 28 });
  currentY += 8;
  doc.text(`Allergies: ${allergyList}`, 14, currentY, { maxWidth: pageWidth - 28 });
  currentY += 10;

  // 30-Day Biometric Vitals Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('2. 30-Day Biometric Telemetry & Rolling Averages', 14, currentY);
  currentY += 4;

  const vitalsData = [
    ['Blood Pressure (Avg)', `${stats.meanSystolic} / ${stats.meanDiastolic} mmHg`, 'Target: <120 / <80 mmHg', stats.meanSystolic < 130 ? 'Controlled' : 'Elevated'],
    ['Mean Arterial Pressure (MAP)', `${stats.meanArterialPressure} mmHg`, 'Normal: 70 - 100 mmHg', stats.meanArterialPressure <= 100 ? 'Normal' : 'Elevated'],
    ['Resting Heart Rate (Avg)', `${stats.meanHeartRate} bpm`, 'Normal: 60 - 100 bpm', 'Optimal'],
    ['Fasting Blood Glucose (Avg)', `${stats.meanGlucose} mg/dL`, 'Target: 70 - 99 mg/dL', stats.meanGlucose <= 100 ? 'Optimal' : 'Elevated'],
    ['Time in Range (70-140 mg/dL)', `${stats.glucoseInRangePercentage}%`, 'Target: ≥70% TIR', stats.glucoseInRangePercentage >= 70 ? 'In Target' : 'Sub-optimal'],
    ['Sleep Duration / Score (Avg)', `${stats.meanSleepHours} hrs / ${stats.meanSleepScore}/100`, 'Target: 7.0 - 9.0 hrs', stats.meanSleepHours >= 7 ? 'Good' : 'Deficit']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Biometric Metric', '30-Day Mean', 'Clinical Reference', 'Status Assessment']],
    body: vitalsData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5, textColor: [51, 65, 85] },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' }, 1: { cellWidth: 40 }, 2: { cellWidth: 55 }, 3: { cellWidth: 35 } },
    didDrawPage: (data) => {
      currentY = data.cursor ? data.cursor.y + 10 : 120;
    }
  });

  // Current Medications & Adherence Table
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Active Medications & Adherence Records', 14, currentY);
  currentY += 4;

  const totalDoses = medicationLogs.length;
  const takenDoses = medicationLogs.filter(l => l.status === 'taken').length;
  const adherencePct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  const medRows = medications.map(med => {
    const medLogs = medicationLogs.filter(l => l.medicationId === med.id);
    const medTaken = medLogs.filter(l => l.status === 'taken').length;
    const medAdh = medLogs.length > 0 ? `${Math.round((medTaken / medLogs.length) * 100)}%` : '100%';
    return [
      med.name,
      med.dosage,
      med.scheduledTime,
      med.indication,
      medAdh,
      `${med.pillsRemaining} doses remaining`
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Medication Name', 'Dosage', 'Schedule', 'Indication', '30d Adherence', 'Supply Status']],
    body: medRows,
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, cellPadding: 2.5, textColor: [51, 65, 85] },
    didDrawPage: (data) => {
      currentY = data.cursor ? data.cursor.y + 10 : 180;
    }
  });

  // Clinical Risk Stratification
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('4. Cardiovascular (ASCVD) & Metabolic Risk Stratification', 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`• 10-Year ASCVD Cardiovascular Disease Risk: ${ascvd.tenYearRiskPercentage}% [${ascvd.riskTier.toUpperCase()} RISK TIER] (Optimal Peer Benchmark: ${ascvd.optimalRiskPercentage}%)`, 14, currentY);
  currentY += 5;
  doc.text(`• Metabolic Syndrome Criteria Met: ${metabolic.metabolicSyndromeCriteriaMet}/5 criteria [${metabolic.hasMetabolicSyndrome ? 'POSITIVE FOR METABOLIC SYNDROME' : 'NEGATIVE'}]`, 14, currentY);
  currentY += 5;
  doc.text(`• Overall Medication Adherence Rate: ${adherencePct}% across ${totalDoses} recorded doses`, 14, currentY);
  currentY += 10;

  // Physician Sign-Off Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, currentY, pageWidth - 28, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Clinical Reviewer Attestation:', 18, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('This standardized summary has been compiled from continuous patient home biometric telemetry and electronic medication adherence logs for clinical decision support.', 18, currentY + 12, { maxWidth: pageWidth - 36 });
  doc.text(`Attending Physician Signature: _______________________      Date: ____________`, 18, currentY + 20);

  doc.save(`VitalPulse_ClinicalSummary_${patient.fullName.replace(/\s+/g, '_')}.pdf`);
}
