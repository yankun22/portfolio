import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { MealEntry, MealType } from '../../types/nutrition';
import { Plus } from 'lucide-react';

interface MealLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onAddMeal: (meal: MealEntry) => void;
}

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onAddMeal
}) => {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState(450);
  const [protein, setProtein] = useState(30);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(15);
  const [fiber, setFiber] = useState(6);
  const [sodium, setSodium] = useState(400);
  const [sugar, setSugar] = useState(4);
  const [glycemic, setGlycemic] = useState<'Low' | 'Medium' | 'High'>('Low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      patientId,
      date: dateStr,
      time: timeStr,
      mealType,
      name: name.trim(),
      calories: Number(calories),
      macros: {
        proteinGrams: Number(protein),
        carbsGrams: Number(carbs),
        fatGrams: Number(fat),
        fiberGrams: Number(fiber)
      },
      micros: {
        sodiumMg: Number(sodium),
        potassiumMg: Math.round(Number(protein) * 15),
        addedSugarGrams: Number(sugar),
        cholesterolMg: 45
      },
      glycemicIndexTag: glycemic
    };

    onAddMeal(newMeal);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Nutritional Meal" maxWidth="540px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Meal Description</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Grilled Chicken Caesar Salad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meal Slot</label>
            <select
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Calories</label>
            <input
              type="number"
              className="form-input"
              min="0"
              required
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Protein (g)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              required
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Carbs (g)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              required
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fats (g)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              required
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Sodium (mg)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={sodium}
              onChange={(e) => setSodium(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Fiber (g)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={fiber}
              onChange={(e) => setFiber(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Added Sugar (g)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              value={sugar}
              onChange={(e) => setSugar(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Glycemic Index Tier</label>
          <select
            className="form-select"
            value={glycemic}
            onChange={(e) => setGlycemic(e.target.value as 'Low' | 'Medium' | 'High')}
          >
            <option value="Low">Low Glycemic (Complex carbs, legumes, veggies)</option>
            <option value="Medium">Medium Glycemic (Brown rice, whole wheat)</option>
            <option value="High">High Glycemic (White bread, refined sweets, soda)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Plus size={14} />
            <span>Add Meal Entry</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
