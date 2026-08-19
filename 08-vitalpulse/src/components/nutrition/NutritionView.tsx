import React, { useState } from 'react';
import type { MealEntry, NutritionWarning } from '../../types/nutrition';
import { HydrationTracker } from './HydrationTracker';
import { MealLoggerModal } from './MealLoggerModal';
import { ClinicalDietAlerts } from './ClinicalDietAlerts';
import { Plus, Apple, Trash2, Utensils } from 'lucide-react';

interface NutritionViewProps {
  patientId: string;
  meals: MealEntry[];
  waterAmountMl: number;
  onUpdateMeals: (meals: MealEntry[]) => void;
  onUpdateWater: (amountMl: number) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  patientId,
  meals,
  waterAmountMl,
  onUpdateMeals,
  onUpdateWater
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  // Targets
  const calorieTarget = 2000;
  const waterTarget = 2500;
  const targetProtein = 120; // g
  const targetCarbs = 180; // g
  const targetFat = 65; // g

  // Totals
  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.macros.proteinGrams, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.macros.carbsGrams, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.macros.fatGrams, 0);
  const totalFiber = todayMeals.reduce((s, m) => s + m.macros.fiberGrams, 0);
  const totalSodium = todayMeals.reduce((s, m) => s + m.micros.sodiumMg, 0);
  const totalSugar = todayMeals.reduce((s, m) => s + m.micros.addedSugarGrams, 0);

  // Calorie progress
  const calPercent = Math.min(100, Math.round((totalCalories / calorieTarget) * 100));

  // Warnings
  const warnings: NutritionWarning[] = [];
  if (totalSodium > 2300) {
    warnings.push({
      id: 'warn-sodium',
      type: 'sodium_high',
      title: 'High Sodium Intake Warning (>2,300 mg)',
      message: `Cumulative sodium today is ${totalSodium} mg. Excess sodium increases vascular resistance and blood pressure.`,
      severity: 'warning'
    });
  } else if (totalSodium > 1800) {
    warnings.push({
      id: 'warn-sodium-caution',
      type: 'sodium_high',
      title: 'Approaching Sodium Threshold',
      message: `Current sodium is ${totalSodium} mg. Target is <2,000 mg for hypertensive management.`,
      severity: 'caution'
    });
  }

  if (totalSugar > 30) {
    warnings.push({
      id: 'warn-sugar',
      type: 'sugar_spike',
      title: 'Elevated Added Sugar Load (>30g)',
      message: `Added sugars today total ${totalSugar}g. High glycemic burden may exacerbate insulin resistance.`,
      severity: 'warning'
    });
  }

  if (waterAmountMl < 1000 && todayMeals.length >= 2) {
    warnings.push({
      id: 'warn-water',
      type: 'dehydrated',
      title: 'Sub-Optimal Hydration Alert',
      message: `Water intake is currently ${waterAmountMl} ml. Adequate hydration promotes renal clearance and stable hemodynamics.`,
      severity: 'caution'
    });
  }

  const handleAddMeal = (meal: MealEntry) => {
    onUpdateMeals([...meals, meal]);
  };

  const handleDeleteMeal = (id: string) => {
    onUpdateMeals(meals.filter((m) => m.id !== id));
  };

  return (
    <div className="nutrition-scroll-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Nutrition &amp; Macro Intelligence
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cardiovascular &amp; metabolic diet tracking with clinical sodium and glycemic warnings
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={15} />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Top Intelligence Grid: Macro Rings & Hydration */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Caloric Budget & Macro Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Apple size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Caloric &amp; Macro Balance
              </h3>
            </div>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Goal: <strong>{calorieTarget} kcal</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* SVG Circular Progress Gauge */}
            <div style={{ width: 100, height: 100, position: 'relative', flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--bg-secondary)"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={totalCalories > calorieTarget ? '#f43f5e' : '#10b981'}
                  strokeWidth="3.2"
                  strokeDasharray={`${calPercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {totalCalories}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>kcal</span>
              </div>
            </div>

            {/* Macro Bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Protein */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>Protein</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalProtein}g / {targetProtein}g</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', marginTop: 3 }}>
                  <div style={{ width: `${Math.min(100, (totalProtein / targetProtein) * 100)}%`, height: '100%', background: '#38bdf8' }} />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>Carbohydrates</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalCarbs}g / {targetCarbs}g</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', marginTop: 3 }}>
                  <div style={{ width: `${Math.min(100, (totalCarbs / targetCarbs) * 100)}%`, height: '100%', background: '#f59e0b' }} />
                </div>
              </div>

              {/* Fats */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: '#ec4899', fontWeight: 700 }}>Healthy Fats</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalFat}g / {targetFat}g</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-secondary)', borderRadius: 999, overflow: 'hidden', marginTop: 3 }}>
                  <div style={{ width: `${Math.min(100, (totalFat / targetFat) * 100)}%`, height: '100%', background: '#ec4899' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <span>Sodium: <strong>{totalSodium} mg</strong></span>
            <span>Fiber: <strong>{totalFiber} g</strong></span>
            <span>Added Sugar: <strong>{totalSugar} g</strong></span>
          </div>
        </div>

        {/* Hydration Tracker */}
        <HydrationTracker
          currentMl={waterAmountMl}
          targetMl={waterTarget}
          onUpdateWater={onUpdateWater}
        />
      </div>

      {/* Clinical Diet Alerts */}
      <ClinicalDietAlerts warnings={warnings} />

      {/* Logged Meals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
          Today&apos;s Meal Logs ({todayMeals.length})
        </h3>

        {todayMeals.length === 0 ? (
          <div
            style={{
              padding: '30px 20px',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-subtle)',
              color: 'var(--text-muted)'
            }}
          >
            <Utensils size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div style={{ fontWeight: 600 }}>No meals logged yet today</div>
            <div style={{ fontSize: '0.75rem', marginTop: 4 }}>
              Record breakfast, lunch, or dinner to calculate macro balance.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem'
                    }}
                  >
                    {meal.mealType === 'breakfast'
                      ? '🥣'
                      : meal.mealType === 'lunch'
                      ? '🥗'
                      : meal.mealType === 'dinner'
                      ? '🍲'
                      : '🍎'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {meal.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-muted)',
                          textTransform: 'capitalize'
                        }}
                      >
                        {meal.mealType}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                      <span>{meal.calories} kcal</span>
                      <span>•</span>
                      <span>P: {meal.macros.proteinGrams}g</span>
                      <span>C: {meal.macros.carbsGrams}g</span>
                      <span>F: {meal.macros.fatGrams}g</span>
                      <span>•</span>
                      <span>Na: {meal.micros.sodiumMg}mg</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-icon"
                  style={{ width: 30, height: 30 }}
                  onClick={() => handleDeleteMeal(meal.id)}
                  title="Delete meal entry"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meal Logger Modal */}
      <MealLoggerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientId={patientId}
        onAddMeal={handleAddMeal}
      />
    </div>
  );
};
