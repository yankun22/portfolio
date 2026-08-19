# 🫀 VitalPulse — Patient Biometric Health & Clinical Analytics Studio

VitalPulse is a patient biometric health dashboard and clinical analytics studio. It connects home patient telemetry (Blood Pressure, Heart Rate, Glucose, Sleep) with clinical risk calculators (ASCVD 10-Year Cardiovascular Disease Risk, Metabolic Syndrome criteria), medication adherence tracking, macro nutrition intelligence, and one-click doctor summary exports.

---

## 🌟 Key Features

### 1. 📊 Biometric Trend Telemetry
- **Interactive Multi-Metric Time-Series SVGs**:
  - **Blood Pressure (Systolic & Diastolic)** with AHA/ACC hypertension stage zones (Normal, Elevated, Stage 1 HTN, Stage 2 HTN).
  - **Resting Heart Rate & HRV** with optimal resting zone shading (60-80 bpm).
  - **Blood Glucose Telemetry** with Fasting (Diamond) vs. Post-Prandial (Circle) markers and ADA target band (70-140 mg/dL).
  - **Sleep Stage Hypnogram** displaying Deep, REM, Light, and Awake stage distributions with 0-100 Quality Scores.
- **Dynamic Timeframe Filtering**: 7 Days, 14 Days, 30 Days, and 90 Days.
- **Quick Vital Logging**: Instant modal to log new readings with live recalculation of 30-day rolling averages and Mean Arterial Pressure (MAP).

### 2. 💊 Medication Adherence Tracker
- **Daily Dosage Scheduler**: Organized into Morning, Afternoon, Evening, and Bedtime slots.
- **Interactive Adherence Actions**: 1-click Take / Skip / Undo status controls.
- **Streak & Performance Counters**:
  - Daily Adherence Streak with celebratory achievements (`🔥 14 Days`).
  - 30-day adherence rate percentage dial (`96% Adherent`).
  - Missed-dose history log and low-inventory prescription refill alerts.

### 3. 🥗 Nutrition & Macro Intelligence
- **Caloric Target & Macro Distribution**: Circular SVG progress gauge showing Calories Consumed vs. Daily Target, with Protein, Carbs, and Fats macro ratio bars.
- **Hydration Tracker**: Animated water level cylinder gauge with quick `+250ml` and `+500ml` logging cups.
- **Clinical Nutritional Alerts**: Automated warnings for high sodium (`>2,300 mg`), glycemic spikes, low fiber, and dehydration.

### 4. 🩺 Clinical Risk Calculator
- **10-Year ASCVD Cardiovascular Disease Risk Model**:
  - Based on AHA/ACC Pooled Cohort Equations (Age, Gender, Total Cholesterol, HDL, Systolic BP, Hypertensive therapy, Smoker status, Diabetes).
  - Dynamic SVG semi-circular risk gauge with tier classification (**Low**, **Borderline**, **Intermediate**, **High**).
- **Metabolic Syndrome & Diabetes Matrix**: Evaluates 5 ATP III / AHA diagnostic criteria with live sliders.
- **Guideline-Directed Interventions**: Personalized clinical recommendations (statin therapy discussion, DASH dietary pattern, 150 min aerobic exercise).

### 5. 📄 Standardized Doctor Summary Export
- **30-Day Clinical Manifest**: Includes patient demographics, active diagnoses, allergies, 30-day vitals averages, active medications list, and physician sign-off block.
- **1-Click PDF Generation**: Standalone multi-page clinical report export via `jspdf` and `jspdf-autotable`.
- **Printable Medical Sheet**: Clean `@media print` layout formatted for A4 printing and physician handoff.
- **EHR JSON Backup & Restore**: Full electronic health record export/import.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Pure Vanilla CSS Design System with Medical Dark & Light Themes
- **Icons**: Lucide React
- **Exporting**: jsPDF & jsPDF-AutoTable
- **Animations**: Canvas-Confetti

---

## 🚀 Getting Started

```bash
# Navigate to directory
cd 08-vitalpulse

# Install dependencies
npm install

# Run dev server
npm run dev

# Run linting check
npm run lint

# Build production bundle
npm run build
```
