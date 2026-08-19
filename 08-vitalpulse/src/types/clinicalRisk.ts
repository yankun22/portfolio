export type RiskTier = 'Low' | 'Borderline' | 'Intermediate' | 'High';

export interface ASCVDRiskInputs {
  age: number; // 20 - 79
  gender: 'male' | 'female';
  totalCholesterol: number; // mg/dL (130 - 320)
  hdlCholesterol: number; // mg/dL (20 - 100)
  systolicBP: number; // mmHg (90 - 200)
  onHypertensionMeds: boolean;
  isSmoker: boolean;
  hasDiabetes: boolean;
  race?: 'white' | 'african_american' | 'other';
}

export interface ASCVDRiskResult {
  tenYearRiskPercentage: number; // e.g. 14.8%
  optimalRiskPercentage: number; // e.g. 2.1% (benchmark if all factors ideal)
  lifetimeRiskPercentage: number; // 20-59 age group
  riskTier: RiskTier;
  riskTierColor: string;
  driverFactors: {
    factor: string;
    impact: 'critical' | 'moderate' | 'optimal';
    detail: string;
  }[];
}

export interface MetabolicRiskInputs {
  bmi: number;
  waistCircumferenceInches: number;
  fastingGlucose: number; // mg/dL
  triglycerides: number; // mg/dL
  hdlCholesterol: number; // mg/dL
  systolicBP: number;
  diastolicBP: number;
}

export interface MetabolicRiskResult {
  metabolicSyndromeCriteriaMet: number; // 0 - 5 criteria
  hasMetabolicSyndrome: boolean;
  scorePercentage: number;
  riskTier: RiskTier;
  criteriaResults: {
    name: string;
    measured: string;
    threshold: string;
    isMet: boolean;
  }[];
}

export interface ClinicalRecommendation {
  id: string;
  category: 'lifestyle' | 'medication_review' | 'nutrition' | 'monitoring';
  title: string;
  action: string;
  evidenceGrade: 'Class I (Strong)' | 'Class IIa (Moderate)' | 'Class IIb (Weak)';
  priority: 'high' | 'medium' | 'low';
}
