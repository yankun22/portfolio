import type { PatientProfile, PatientHealthRecord } from '../types/patient';
import type { BloodPressureReading, HeartRateReading, GlucoseReading, SleepRecord } from '../types/biometrics';
import type { MedicationSchedule, MedicationDoseLog } from '../types/medications';
import type { MealEntry } from '../types/nutrition';
import { getHypertensionStage, getGlucoseTier, getHeartRateZone } from './referenceRanges';

// Helper to generate past dates
function getDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

// ---------------------------------------------------------
// Patient 1: Eleanor Vance (62, Hypertensive & Pre-Diabetic)
// ---------------------------------------------------------
export const PATIENT_ELEANOR: PatientProfile = {
  id: 'patient-eleanor-vance',
  mrn: 'VP-84920',
  fullName: 'Eleanor Vance',
  preferredName: 'Eleanor',
  age: 62,
  dob: '1964-03-14',
  gender: 'female',
  bloodType: 'A+',
  avatarColor: '#3b82f6',
  avatarEmoji: '👩‍🦳',
  heightCm: 165,
  weightKg: 78.5,
  bmi: 28.8,
  primaryPhysician: {
    name: 'Dr. Rebecca Chen, MD, FACC',
    specialty: 'Cardiovascular Medicine',
    clinic: 'Metropolitan Heart & Vascular Institute',
    phone: '(555) 382-9011'
  },
  diagnoses: [
    { code: 'I10', name: 'Essential Primary Hypertension', diagnosedDate: '2021-06-10', status: 'active' },
    { code: 'E11.9', name: 'Type 2 Pre-Diabetes (Impaired Fasting Glucose)', diagnosedDate: '2023-01-18', status: 'active' },
    { code: 'E78.0', name: 'Pure Hypercholesterolemia', diagnosedDate: '2022-09-04', status: 'managed' }
  ],
  allergies: [
    { allergen: 'Penicillin', severity: 'Severe (Anaphylaxis)', reaction: 'Hives, bronchospasm' },
    { allergen: 'Sulfa Drugs', severity: 'Moderate', reaction: 'Maculopapular rash' }
  ],
  emergencyContact: {
    name: 'David Vance (Son)',
    relationship: 'Family / Primary Caregiver',
    phone: '(555) 912-4402'
  },
  riskBaseline: {
    ascvd: {
      age: 62,
      gender: 'female',
      totalCholesterol: 218,
      hdlCholesterol: 48,
      systolicBP: 136,
      onHypertensionMeds: true,
      isSmoker: false,
      hasDiabetes: true,
      race: 'white'
    },
    metabolic: {
      bmi: 28.8,
      waistCircumferenceInches: 36.5,
      fastingGlucose: 114,
      triglycerides: 175,
      hdlCholesterol: 48,
      systolicBP: 136,
      diastolicBP: 84
    }
  }
};

// ---------------------------------------------------------
// Patient 2: Marcus Thorne (45, Post-MI recovery & Lipid Optimization)
// ---------------------------------------------------------
export const PATIENT_MARCUS: PatientProfile = {
  id: 'patient-marcus-thorne',
  mrn: 'VP-91044',
  fullName: 'Marcus Thorne',
  preferredName: 'Marcus',
  age: 45,
  dob: '1981-11-22',
  gender: 'male',
  bloodType: 'O+',
  avatarColor: '#10b981',
  avatarEmoji: '👨‍🦰',
  heightCm: 182,
  weightKg: 89.0,
  bmi: 26.9,
  primaryPhysician: {
    name: 'Dr. Arthur Sterling, MD',
    specialty: 'Interventional Cardiology',
    clinic: 'Summit Cardiac Care Center',
    phone: '(555) 749-1120'
  },
  diagnoses: [
    { code: 'I25.10', name: 'Atherosclerotic Heart Disease (Post-Stent)', diagnosedDate: '2025-02-14', status: 'managed' },
    { code: 'E78.2', name: 'Mixed Hyperlipidemia', diagnosedDate: '2024-08-11', status: 'active' },
    { code: 'I10', name: 'Controlled Hypertension', diagnosedDate: '2024-04-02', status: 'managed' }
  ],
  allergies: [
    { allergen: 'Aspirin (High Dose)', severity: 'Mild', reaction: 'Gastric irritation' }
  ],
  emergencyContact: {
    name: 'Elena Thorne (Spouse)',
    relationship: 'Spouse',
    phone: '(555) 438-9921'
  },
  riskBaseline: {
    ascvd: {
      age: 45,
      gender: 'male',
      totalCholesterol: 185,
      hdlCholesterol: 42,
      systolicBP: 124,
      onHypertensionMeds: true,
      isSmoker: false,
      hasDiabetes: false,
      race: 'white'
    },
    metabolic: {
      bmi: 26.9,
      waistCircumferenceInches: 35.0,
      fastingGlucose: 92,
      triglycerides: 145,
      hdlCholesterol: 42,
      systolicBP: 124,
      diastolicBP: 78
    }
  }
};

// ---------------------------------------------------------
// Patient 3: Sarah Lin (29, Athlete Biometric Tracking & Sleep)
// ---------------------------------------------------------
export const PATIENT_SARAH: PatientProfile = {
  id: 'patient-sarah-lin',
  mrn: 'VP-33019',
  fullName: 'Sarah Lin',
  preferredName: 'Sarah',
  age: 29,
  dob: '1997-07-09',
  gender: 'female',
  bloodType: 'B+',
  avatarColor: '#8b5cf6',
  avatarEmoji: '👩',
  heightCm: 170,
  weightKg: 61.2,
  bmi: 21.2,
  primaryPhysician: {
    name: 'Dr. Michael Hansen, DO',
    specialty: 'Sports Medicine & Preventive Health',
    clinic: 'Olympic Peak Health & Wellness',
    phone: '(555) 883-2044'
  },
  diagnoses: [
    { code: 'G47.00', name: 'Transient Sleep Onset Insomnia (Work Stress)', diagnosedDate: '2025-10-05', status: 'managed' }
  ],
  allergies: [],
  emergencyContact: {
    name: 'Kevin Lin (Brother)',
    relationship: 'Sibling',
    phone: '(555) 720-3311'
  },
  riskBaseline: {
    ascvd: {
      age: 29,
      gender: 'female',
      totalCholesterol: 165,
      hdlCholesterol: 64,
      systolicBP: 112,
      onHypertensionMeds: false,
      isSmoker: false,
      hasDiabetes: false,
      race: 'other'
    },
    metabolic: {
      bmi: 21.2,
      waistCircumferenceInches: 27.5,
      fastingGlucose: 84,
      triglycerides: 78,
      hdlCholesterol: 64,
      systolicBP: 112,
      diastolicBP: 72
    }
  }
};

export const INITIAL_PATIENTS: PatientProfile[] = [
  PATIENT_ELEANOR,
  PATIENT_MARCUS,
  PATIENT_SARAH
];

// Helper to generate 30-day realistic historical vitals for Eleanor
function generateEleanorHealthRecord(): PatientHealthRecord {
  const bpReadings: BloodPressureReading[] = [];
  const hrReadings: HeartRateReading[] = [];
  const glucoseReadings: GlucoseReading[] = [];
  const sleepRecords: SleepRecord[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);

    // Blood pressure trend: starts ~142/91, gradually improves to ~132/83 over 30 days
    const improvementFactor = (29 - i) / 29;
    const baseSys = Math.round(142 - improvementFactor * 10 + (Math.sin(i * 0.9) * 4));
    const baseDia = Math.round(91 - improvementFactor * 8 + (Math.cos(i * 0.7) * 3));
    const pulse = Math.round(72 + Math.sin(i) * 5);

    bpReadings.push({
      id: `bp-eleanor-${i}`,
      timestamp: `${date} 08:30`,
      date,
      systolic: baseSys,
      diastolic: baseDia,
      pulse,
      hypertensionStage: getHypertensionStage(baseSys, baseDia),
      notes: i === 12 ? 'Felt mild morning headache' : i === 0 ? 'Post-walk reading' : undefined,
      isAnomaly: baseSys >= 150
    });

    // Resting Heart Rate
    const restingBpm = Math.round(68 + (Math.sin(i * 0.5) * 4));
    hrReadings.push({
      id: `hr-eleanor-${i}`,
      timestamp: `${date} 07:00`,
      date,
      bpm: restingBpm + 4,
      restingBpm,
      hrvRmssd: Math.round(38 + Math.cos(i) * 6),
      zone: getHeartRateZone(restingBpm)
    });

    // Fasting Glucose: starts ~124 mg/dL, stabilizes ~110 mg/dL
    const fastingVal = Math.round(124 - improvementFactor * 14 + (Math.sin(i * 1.3) * 5));
    glucoseReadings.push({
      id: `glu-eleanor-${i}`,
      timestamp: `${date} 07:30`,
      date,
      value: fastingVal,
      state: 'Fasting',
      tier: getGlucoseTier(fastingVal, true),
      mealTag: 'Pre-Breakfast'
    });

    // Post-prandial dinner check every 2 days
    if (i % 2 === 0) {
      const postDinnerVal = Math.round(155 - improvementFactor * 18 + (Math.cos(i * 0.8) * 8));
      glucoseReadings.push({
        id: `glu-eleanor-post-${i}`,
        timestamp: `${date} 20:15`,
        date,
        value: postDinnerVal,
        state: 'Post-Prandial',
        tier: getGlucoseTier(postDinnerVal, false),
        mealTag: '2hr Post-Dinner'
      });
    }

    // Sleep stages (avg ~7.2 hrs)
    const totalSleep = parseFloat((6.6 + (Math.sin(i * 0.4) * 0.8) + 0.3).toFixed(1));
    const deepMin = Math.round(totalSleep * 60 * 0.18);
    const remMin = Math.round(totalSleep * 60 * 0.22);
    const lightMin = Math.round(totalSleep * 60 * 0.50);
    const awakeMin = Math.round(totalSleep * 60 * 0.10);
    const sleepScore = Math.min(100, Math.max(50, Math.round(75 + Math.sin(i * 0.6) * 12)));

    sleepRecords.push({
      id: `sleep-eleanor-${i}`,
      date,
      totalSleepHours: totalSleep,
      efficiencyPercentage: Math.round((1 - (awakeMin / (totalSleep * 60))) * 100),
      score: sleepScore,
      stages: {
        deepMinutes: deepMin,
        remMinutes: remMin,
        lightMinutes: lightMin,
        awakeMinutes: awakeMin
      },
      respiratoryRateAvg: 14.5,
      spO2Avg: 97
    });
  }

  // Medications for Eleanor
  const medications: MedicationSchedule[] = [
    {
      id: 'med-1',
      patientId: PATIENT_ELEANOR.id,
      name: 'Lisinopril',
      dosage: '10 mg',
      form: 'tablet',
      timeSlot: 'morning',
      scheduledTime: '08:00 AM',
      instructions: 'Take 1 tablet in the morning with a full glass of water.',
      color: '#3b82f6',
      indication: 'Blood Pressure Control',
      pillsRemaining: 18,
      totalRefillPills: 30,
      refillThresholdDays: 7,
      prescribingDoctor: 'Dr. Rebecca Chen',
      startDate: '2023-01-15'
    },
    {
      id: 'med-2',
      patientId: PATIENT_ELEANOR.id,
      name: 'Metformin XR',
      dosage: '500 mg',
      form: 'tablet',
      timeSlot: 'evening',
      scheduledTime: '06:30 PM',
      instructions: 'Take with evening meal to minimize GI upset.',
      color: '#10b981',
      indication: 'Insulin Sensitivity / Pre-Diabetes',
      pillsRemaining: 8,
      totalRefillPills: 60,
      refillThresholdDays: 5,
      prescribingDoctor: 'Dr. Rebecca Chen',
      startDate: '2023-04-10'
    },
    {
      id: 'med-3',
      patientId: PATIENT_ELEANOR.id,
      name: 'Atorvastatin',
      dosage: '20 mg',
      form: 'tablet',
      timeSlot: 'bedtime',
      scheduledTime: '10:00 PM',
      instructions: 'Take at bedtime. Avoid grapefruit products.',
      color: '#8b5cf6',
      indication: 'Lipid Management',
      pillsRemaining: 24,
      totalRefillPills: 30,
      refillThresholdDays: 7,
      prescribingDoctor: 'Dr. Rebecca Chen',
      startDate: '2023-02-01'
    }
  ];

  // Generate 30-day adherence dose logs (high adherence with 2 missed doses)
  const medicationLogs: MedicationDoseLog[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);
    medications.forEach(med => {
      // 2 missed doses in past month for realism
      const isMissed = (i === 17 && med.id === 'med-2') || (i === 6 && med.id === 'med-3');
      medicationLogs.push({
        id: `log-${med.id}-${i}`,
        medicationId: med.id,
        date,
        timeSlot: med.timeSlot,
        status: isMissed ? 'missed' : 'taken',
        loggedAt: isMissed ? undefined : `${date} ${med.scheduledTime}`,
        skipReason: isMissed ? 'Forgot while traveling' : undefined
      });
    });
  }

  // Sample Meals
  const meals: MealEntry[] = [
    {
      id: 'meal-today-1',
      patientId: PATIENT_ELEANOR.id,
      date: getDateString(0),
      time: '08:15',
      mealType: 'breakfast',
      name: 'Steel-cut Oatmeal with Blueberries & Chia Seeds',
      calories: 340,
      macros: { proteinGrams: 14, carbsGrams: 52, fatGrams: 9, fiberGrams: 9 },
      micros: { sodiumMg: 95, potassiumMg: 380, addedSugarGrams: 0, cholesterolMg: 0 },
      glycemicIndexTag: 'Low'
    },
    {
      id: 'meal-today-2',
      patientId: PATIENT_ELEANOR.id,
      date: getDateString(0),
      time: '13:00',
      mealType: 'lunch',
      name: 'Grilled Salmon Quinoa Bowl with Steamed Broccoli',
      calories: 520,
      macros: { proteinGrams: 42, carbsGrams: 44, fatGrams: 18, fiberGrams: 7 },
      micros: { sodiumMg: 420, potassiumMg: 710, addedSugarGrams: 2, cholesterolMg: 65 },
      glycemicIndexTag: 'Low'
    },
    {
      id: 'meal-today-3',
      patientId: PATIENT_ELEANOR.id,
      date: getDateString(0),
      time: '19:00',
      mealType: 'dinner',
      name: 'Mediterranean Herb Chicken & Roasted Vegetable Medley',
      calories: 480,
      macros: { proteinGrams: 46, carbsGrams: 32, fatGrams: 16, fiberGrams: 8 },
      micros: { sodiumMg: 580, potassiumMg: 640, addedSugarGrams: 1, cholesterolMg: 85 },
      glycemicIndexTag: 'Low'
    }
  ];

  const waterLogs = [
    { date: getDateString(0), amountMl: 1750 },
    { date: getDateString(1), amountMl: 2250 },
    { date: getDateString(2), amountMl: 2000 }
  ];

  return {
    patient: PATIENT_ELEANOR,
    bloodPressure: bpReadings,
    heartRate: hrReadings,
    glucose: glucoseReadings,
    sleep: sleepRecords,
    medications,
    medicationLogs,
    meals,
    waterLogs
  };
}

// Generate Marcus Health Record
function generateMarcusHealthRecord(): PatientHealthRecord {
  const bpReadings: BloodPressureReading[] = [];
  const hrReadings: HeartRateReading[] = [];
  const glucoseReadings: GlucoseReading[] = [];
  const sleepRecords: SleepRecord[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);
    const baseSys = Math.round(124 + Math.sin(i * 0.7) * 4);
    const baseDia = Math.round(78 + Math.cos(i * 0.5) * 3);
    const restingBpm = Math.round(62 + Math.sin(i * 0.4) * 3);

    bpReadings.push({
      id: `bp-marcus-${i}`,
      timestamp: `${date} 07:45`,
      date,
      systolic: baseSys,
      diastolic: baseDia,
      pulse: restingBpm + 4,
      hypertensionStage: getHypertensionStage(baseSys, baseDia)
    });

    hrReadings.push({
      id: `hr-marcus-${i}`,
      timestamp: `${date} 07:00`,
      date,
      bpm: restingBpm,
      restingBpm,
      hrvRmssd: 46,
      zone: getHeartRateZone(restingBpm)
    });

    const gluc = Math.round(92 + Math.sin(i * 1.1) * 4);
    glucoseReadings.push({
      id: `glu-marcus-${i}`,
      timestamp: `${date} 07:30`,
      date,
      value: gluc,
      state: 'Fasting',
      tier: getGlucoseTier(gluc, true)
    });

    const totalSleep = parseFloat((7.4 + Math.sin(i * 0.3) * 0.6).toFixed(1));
    sleepRecords.push({
      id: `sleep-marcus-${i}`,
      date,
      totalSleepHours: totalSleep,
      efficiencyPercentage: 92,
      score: 84,
      stages: {
        deepMinutes: Math.round(totalSleep * 60 * 0.22),
        remMinutes: Math.round(totalSleep * 60 * 0.24),
        lightMinutes: Math.round(totalSleep * 60 * 0.48),
        awakeMinutes: Math.round(totalSleep * 60 * 0.06)
      }
    });
  }

  const medications: MedicationSchedule[] = [
    {
      id: 'med-m-1',
      patientId: PATIENT_MARCUS.id,
      name: 'Rosuvastatin',
      dosage: '20 mg',
      form: 'tablet',
      timeSlot: 'bedtime',
      scheduledTime: '10:00 PM',
      instructions: 'Take at bedtime for maximal lipid lowering.',
      color: '#8b5cf6',
      indication: 'Post-MI Plaque Stabilization',
      pillsRemaining: 22,
      totalRefillPills: 30,
      refillThresholdDays: 7,
      startDate: '2025-02-15'
    },
    {
      id: 'med-m-2',
      patientId: PATIENT_MARCUS.id,
      name: 'Metoprolol Succinate',
      dosage: '25 mg',
      form: 'tablet',
      timeSlot: 'morning',
      scheduledTime: '08:00 AM',
      instructions: 'Take with morning meal.',
      color: '#3b82f6',
      indication: 'Beta-Blocker / Rate Control',
      pillsRemaining: 15,
      totalRefillPills: 30,
      refillThresholdDays: 7,
      startDate: '2025-02-15'
    }
  ];

  const medicationLogs: MedicationDoseLog[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);
    medications.forEach(m => {
      medicationLogs.push({
        id: `log-${m.id}-${i}`,
        medicationId: m.id,
        date,
        timeSlot: m.timeSlot,
        status: 'taken',
        loggedAt: `${date} ${m.scheduledTime}`
      });
    });
  }

  return {
    patient: PATIENT_MARCUS,
    bloodPressure: bpReadings,
    heartRate: hrReadings,
    glucose: glucoseReadings,
    sleep: sleepRecords,
    medications,
    medicationLogs,
    meals: [],
    waterLogs: [{ date: getDateString(0), amountMl: 2500 }]
  };
}

// Generate Sarah Health Record
function generateSarahHealthRecord(): PatientHealthRecord {
  const bpReadings: BloodPressureReading[] = [];
  const hrReadings: HeartRateReading[] = [];
  const glucoseReadings: GlucoseReading[] = [];
  const sleepRecords: SleepRecord[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);
    const baseSys = Math.round(112 + Math.sin(i * 0.6) * 3);
    const baseDia = Math.round(72 + Math.cos(i * 0.4) * 2);
    const restingBpm = Math.round(54 + Math.sin(i * 0.3) * 3);

    bpReadings.push({
      id: `bp-sarah-${i}`,
      timestamp: `${date} 07:15`,
      date,
      systolic: baseSys,
      diastolic: baseDia,
      pulse: restingBpm,
      hypertensionStage: 'Normal'
    });

    hrReadings.push({
      id: `hr-sarah-${i}`,
      timestamp: `${date} 06:45`,
      date,
      bpm: restingBpm,
      restingBpm,
      hrvRmssd: 64,
      zone: 'Bradycardia' // athletic bradycardia
    });

    const gluc = Math.round(84 + Math.sin(i * 0.8) * 3);
    glucoseReadings.push({
      id: `glu-sarah-${i}`,
      timestamp: `${date} 07:30`,
      date,
      value: gluc,
      state: 'Fasting',
      tier: 'Optimal'
    });

    const totalSleep = parseFloat((7.8 + Math.sin(i * 0.5) * 0.6).toFixed(1));
    sleepRecords.push({
      id: `sleep-sarah-${i}`,
      date,
      totalSleepHours: totalSleep,
      efficiencyPercentage: 94,
      score: 88,
      stages: {
        deepMinutes: Math.round(totalSleep * 60 * 0.25),
        remMinutes: Math.round(totalSleep * 60 * 0.25),
        lightMinutes: Math.round(totalSleep * 60 * 0.45),
        awakeMinutes: Math.round(totalSleep * 60 * 0.05)
      }
    });
  }

  const medications: MedicationSchedule[] = [
    {
      id: 'med-s-1',
      patientId: PATIENT_SARAH.id,
      name: 'Magnesium Glycinate',
      dosage: '400 mg',
      form: 'capsule',
      timeSlot: 'bedtime',
      scheduledTime: '09:30 PM',
      instructions: 'Take 30 minutes before sleep for muscle recovery.',
      color: '#ec4899',
      indication: 'Sleep Architecture & Recovery',
      pillsRemaining: 45,
      totalRefillPills: 60,
      refillThresholdDays: 10,
      startDate: '2025-06-01'
    }
  ];

  const medicationLogs: MedicationDoseLog[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = getDateString(i);
    medications.forEach(m => {
      medicationLogs.push({
        id: `log-${m.id}-${i}`,
        medicationId: m.id,
        date,
        timeSlot: m.timeSlot,
        status: 'taken',
        loggedAt: `${date} ${m.scheduledTime}`
      });
    });
  }

  return {
    patient: PATIENT_SARAH,
    bloodPressure: bpReadings,
    heartRate: hrReadings,
    glucose: glucoseReadings,
    sleep: sleepRecords,
    medications,
    medicationLogs,
    meals: [],
    waterLogs: [{ date: getDateString(0), amountMl: 3000 }]
  };
}

export const INITIAL_HEALTH_RECORDS: Record<string, PatientHealthRecord> = {
  [PATIENT_ELEANOR.id]: generateEleanorHealthRecord(),
  [PATIENT_MARCUS.id]: generateMarcusHealthRecord(),
  [PATIENT_SARAH.id]: generateSarahHealthRecord()
};
