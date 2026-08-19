import type {
  ASCVDRiskInputs,
  ASCVDRiskResult,
  MetabolicRiskInputs,
  MetabolicRiskResult,
  ClinicalRecommendation,
  RiskTier
} from '../types/clinicalRisk';

/**
 * Calculates 10-Year ASCVD Risk using ACC/AHA Pooled Cohort Equations
 */
export function calculateASCVDRisk(inputs: ASCVDRiskInputs): ASCVDRiskResult {
  const {
    age,
    gender,
    totalCholesterol,
    hdlCholesterol,
    systolicBP,
    onHypertensionMeds,
    isSmoker,
    hasDiabetes
  } = inputs;

  const isFemale = gender === 'female';

  // Pooled Cohort Equation Coefficients (Standard Non-African-American / General model)
  const lnAge = Math.log(Math.max(20, Math.min(79, age)));
  const lnTotChol = Math.log(totalCholesterol);
  const lnHdl = Math.log(hdlCholesterol);
  const lnSysBp = Math.log(systolicBP);

  let indSum = 0;
  let meanCoeff = 0;
  let baselineSurvival = 0;

  if (isFemale) {
    // Female coefficients
    indSum =
      -29.799 * lnAge +
      4.884 * Math.pow(lnAge, 2) +
      13.54 * lnTotChol +
      -3.114 * (lnAge * lnTotChol) +
      -13.578 * lnHdl +
      3.149 * (lnAge * lnHdl) +
      (onHypertensionMeds ? 2.019 * lnSysBp : 1.957 * lnSysBp) +
      (isSmoker ? 7.574 - 1.665 * lnAge : 0) +
      (hasDiabetes ? 0.661 : 0);

    meanCoeff = -29.18;
    baselineSurvival = 0.9665;
  } else {
    // Male coefficients
    indSum =
      12.344 * lnAge +
      11.853 * lnTotChol +
      -2.664 * (lnAge * lnTotChol) +
      -7.99 * lnHdl +
      1.769 * (lnAge * lnHdl) +
      (onHypertensionMeds ? 1.797 * lnSysBp : 1.764 * lnSysBp) +
      (isSmoker ? 7.837 - 1.795 * lnAge : 0) +
      (hasDiabetes ? 0.658 : 0);

    meanCoeff = 61.18;
    baselineSurvival = 0.9144;
  }

  const expTerm = Math.exp(indSum - meanCoeff);
  const calculatedRisk = (1 - Math.pow(baselineSurvival, expTerm)) * 100;
  const clampedRisk = Math.max(0.4, Math.min(75.0, Math.round(calculatedRisk * 10) / 10));

  // Determine Risk Tier
  let riskTier: RiskTier = 'Low';
  let riskTierColor = '#10b981'; // Green

  if (clampedRisk >= 20.0) {
    riskTier = 'High';
    riskTierColor = '#f43f5e'; // Rose / Red
  } else if (clampedRisk >= 7.5) {
    riskTier = 'Intermediate';
    riskTierColor = '#f97316'; // Orange
  } else if (clampedRisk >= 5.0) {
    riskTier = 'Borderline';
    riskTierColor = '#f59e0b'; // Amber
  }

  // Driver factor breakdown
  const driverFactors: { factor: string; impact: 'critical' | 'moderate' | 'optimal'; detail: string }[] = [];

  if (systolicBP >= 140) {
    driverFactors.push({
      factor: 'Systolic Blood Pressure',
      impact: 'critical',
      detail: `${systolicBP} mmHg is above Stage 2 HTN threshold (>140 mmHg).`
    });
  } else if (systolicBP >= 130) {
    driverFactors.push({
      factor: 'Systolic Blood Pressure',
      impact: 'moderate',
      detail: `${systolicBP} mmHg (Stage 1 HTN range).`
    });
  } else {
    driverFactors.push({
      factor: 'Systolic Blood Pressure',
      impact: 'optimal',
      detail: `${systolicBP} mmHg within target bounds.`
    });
  }

  const cholRatio = totalCholesterol / hdlCholesterol;
  if (cholRatio >= 5.0 || totalCholesterol >= 240) {
    driverFactors.push({
      factor: 'Cholesterol Ratio (TC/HDL)',
      impact: 'critical',
      detail: `TC/HDL ratio of ${cholRatio.toFixed(1)}:1 (Total ${totalCholesterol}, HDL ${hdlCholesterol}).`
    });
  } else if (cholRatio >= 3.8 || totalCholesterol >= 200) {
    driverFactors.push({
      factor: 'Cholesterol Ratio (TC/HDL)',
      impact: 'moderate',
      detail: `TC/HDL ratio of ${cholRatio.toFixed(1)}:1.`
    });
  } else {
    driverFactors.push({
      factor: 'Cholesterol Ratio (TC/HDL)',
      impact: 'optimal',
      detail: `Favorable lipid profile (ratio ${cholRatio.toFixed(1)}:1).`
    });
  }

  if (hasDiabetes) {
    driverFactors.push({
      factor: 'Glycemic Status',
      impact: 'critical',
      detail: 'Diabetes significantly elevates baseline cardiovascular vulnerability.'
    });
  }

  if (isSmoker) {
    driverFactors.push({
      factor: 'Tobacco Use',
      impact: 'critical',
      detail: 'Active tobacco use doubles vascular atherogenesis risk.'
    });
  }

  const optimalRisk = Math.max(0.3, Math.min(2.5, Math.round((age > 50 ? 1.8 : 0.8) * 10) / 10));
  const lifetimeRisk = clampedRisk * 2.8 > 50 ? 50 : Math.round(clampedRisk * 2.8);

  return {
    tenYearRiskPercentage: clampedRisk,
    optimalRiskPercentage: optimalRisk,
    lifetimeRiskPercentage: Math.min(65, Math.max(8, lifetimeRisk)),
    riskTier,
    riskTierColor,
    driverFactors
  };
}

/**
 * Evaluates Metabolic Syndrome (AHA / NHLBI / ATP III criteria)
 */
export function calculateMetabolicRisk(inputs: MetabolicRiskInputs, gender: 'male' | 'female'): MetabolicRiskResult {
  const isFemale = gender === 'female';

  const criteriaResults = [
    {
      name: 'Elevated Waist Circumference',
      measured: `${inputs.waistCircumferenceInches} inches`,
      threshold: isFemale ? '> 35 inches' : '> 40 inches',
      isMet: isFemale ? inputs.waistCircumferenceInches >= 35 : inputs.waistCircumferenceInches >= 40
    },
    {
      name: 'Elevated Triglycerides',
      measured: `${inputs.triglycerides} mg/dL`,
      threshold: '≥ 150 mg/dL',
      isMet: inputs.triglycerides >= 150
    },
    {
      name: 'Reduced HDL Cholesterol',
      measured: `${inputs.hdlCholesterol} mg/dL`,
      threshold: isFemale ? '< 50 mg/dL' : '< 40 mg/dL',
      isMet: isFemale ? inputs.hdlCholesterol < 50 : inputs.hdlCholesterol < 40
    },
    {
      name: 'Elevated Blood Pressure',
      measured: `${inputs.systolicBP}/${inputs.diastolicBP} mmHg`,
      threshold: '≥ 130/85 mmHg',
      isMet: inputs.systolicBP >= 130 || inputs.diastolicBP >= 85
    },
    {
      name: 'Elevated Fasting Glucose',
      measured: `${inputs.fastingGlucose} mg/dL`,
      threshold: '≥ 100 mg/dL',
      isMet: inputs.fastingGlucose >= 100
    }
  ];

  const criteriaMetCount = criteriaResults.filter(c => c.isMet).length;
  const hasMetabolicSyndrome = criteriaMetCount >= 3;
  const scorePercentage = Math.round((criteriaMetCount / 5) * 100);

  let riskTier: RiskTier = 'Low';
  if (criteriaMetCount >= 4) riskTier = 'High';
  else if (criteriaMetCount === 3) riskTier = 'Intermediate';
  else if (criteriaMetCount >= 1) riskTier = 'Borderline';

  return {
    metabolicSyndromeCriteriaMet: criteriaMetCount,
    hasMetabolicSyndrome,
    scorePercentage,
    riskTier,
    criteriaResults
  };
}

/**
 * Generates tailored clinical recommendations based on risk stratification
 */
export function generateClinicalRecommendations(
  ascvd: ASCVDRiskResult,
  metabolic: MetabolicRiskResult
): ClinicalRecommendation[] {
  const recs: ClinicalRecommendation[] = [];

  if (ascvd.riskTier === 'High' || ascvd.riskTier === 'Intermediate') {
    recs.push({
      id: 'rec-statin',
      category: 'medication_review',
      title: 'Discuss Moderate-to-High Intensity Statin Therapy',
      action: 'Guideline-directed therapy recommended to achieve ≥50% LDL-C reduction for high ASCVD risk.',
      evidenceGrade: 'Class I (Strong)',
      priority: 'high'
    });
  }

  if (metabolic.criteriaResults.some(c => c.name.includes('Blood Pressure') && c.isMet)) {
    recs.push({
      id: 'rec-dash',
      category: 'nutrition',
      title: 'Adopt DASH / Mediterranean Dietary Pattern',
      action: 'Limit dietary sodium to <1,500 - 2,000 mg/day; emphasize potassium-rich legumes, leafy greens, and whole grains.',
      evidenceGrade: 'Class I (Strong)',
      priority: 'high'
    });
  }

  if (metabolic.criteriaResults.some(c => c.name.includes('Glucose') && c.isMet)) {
    recs.push({
      id: 'rec-glucose',
      category: 'nutrition',
      title: 'Target Low Glycemic Load & Post-Meal Walks',
      action: '15-minute gentle stroll following dinner reduces post-prandial glucose excursions by 20-30%.',
      evidenceGrade: 'Class IIa (Moderate)',
      priority: 'medium'
    });
  }

  recs.push({
    id: 'rec-exercise',
    category: 'lifestyle',
    title: '150 min/Week Moderate-Intensity Aerobic Activity',
    action: 'Brisk walking, cycling, or swimming in 30-min sessions 5 days per week enhances endothelial elasticity and insulin sensitivity.',
    evidenceGrade: 'Class I (Strong)',
    priority: 'high'
  });

  recs.push({
    id: 'rec-monitoring',
    category: 'monitoring',
    title: 'Dual-Morning Home Blood Pressure Log Protocol',
    action: 'Log 2 readings 1 minute apart each morning after resting quietly for 5 minutes prior to medication.',
    evidenceGrade: 'Class I (Strong)',
    priority: 'medium'
  });

  return recs;
}
