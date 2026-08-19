export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroNutrients {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
}

export interface MicroNutrients {
  sodiumMg: number; // Critical for hypertension (e.g. max 2300mg/day)
  potassiumMg: number; // Important for BP regulation
  addedSugarGrams: number; // Critical for glucose control
  cholesterolMg: number;
}

export interface MealEntry {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealType: MealType;
  name: string;
  calories: number;
  macros: MacroNutrients;
  micros: MicroNutrients;
  glycemicIndexTag?: 'Low' | 'Medium' | 'High';
}

export interface DailyNutritionSummary {
  date: string;
  calorieTarget: number;
  totalCalories: number;
  calorieBalance: number; // Target - Consumed
  macros: MacroNutrients;
  macroTargets: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  micros: MicroNutrients;
  waterIntakeMl: number;
  waterTargetMl: number;
  clinicalWarnings: NutritionWarning[];
}

export interface NutritionWarning {
  id: string;
  type: 'sodium_high' | 'sugar_spike' | 'calorie_surplus' | 'fiber_low' | 'dehydrated';
  title: string;
  message: string;
  severity: 'caution' | 'warning' | 'info';
}
