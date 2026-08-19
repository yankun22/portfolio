import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { MedicationSchedule, TimeOfDaySlot } from '../../types/medications';
import { Plus } from 'lucide-react';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onAddMedication: (medication: MedicationSchedule) => void;
}

const MED_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onAddMedication
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<MedicationSchedule['form']>('tablet');
  const [timeSlot, setTimeSlot] = useState<TimeOfDaySlot>('morning');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [instructions, setInstructions] = useState('Take with food');
  const [indication, setIndication] = useState('Blood Pressure Control');
  const [pillsRemaining, setPillsRemaining] = useState(30);
  const [selectedColor, setSelectedColor] = useState(MED_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const newMed: MedicationSchedule = {
      id: `med-${Date.now()}`,
      patientId,
      name: name.trim(),
      dosage: dosage.trim(),
      form,
      timeSlot,
      scheduledTime,
      instructions: instructions.trim(),
      color: selectedColor,
      indication: indication.trim(),
      pillsRemaining: Number(pillsRemaining),
      totalRefillPills: Number(pillsRemaining),
      refillThresholdDays: 7,
      startDate: new Date().toISOString().split('T')[0]
    };

    onAddMedication(newMed);
    setName('');
    setDosage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Scheduled Medication" maxWidth="520px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Medication Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Amlodipine, Lisinopril"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dosage</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. 5 mg, 500 mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Dose Form</label>
            <select
              className="form-select"
              value={form}
              onChange={(e) => setForm(e.target.value as MedicationSchedule['form'])}
            >
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="injection">Injection</option>
              <option value="liquid">Liquid</option>
              <option value="inhaler">Inhaler</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Time of Day Slot</label>
            <select
              className="form-select"
              value={timeSlot}
              onChange={(e) => {
                const val = e.target.value as TimeOfDaySlot;
                setTimeSlot(val);
                if (val === 'morning') setScheduledTime('08:00 AM');
                else if (val === 'afternoon') setScheduledTime('01:00 PM');
                else if (val === 'evening') setScheduledTime('06:30 PM');
                else if (val === 'bedtime') setScheduledTime('10:00 PM');
              }}
            >
              <option value="morning">Morning (Breakfast)</option>
              <option value="afternoon">Afternoon (Lunch)</option>
              <option value="evening">Evening (Dinner)</option>
              <option value="bedtime">Bedtime</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Scheduled Time</label>
            <input
              type="text"
              className="form-input"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Supply Count (Tablets)</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="365"
              value={pillsRemaining}
              onChange={(e) => setPillsRemaining(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Clinical Indication</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Hypertension, Lipid Lowering, Pre-Diabetes"
            value={indication}
            onChange={(e) => setIndication(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Patient Instructions</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Take with morning meal and full glass of water"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* Color Picker */}
        <div className="form-group">
          <label className="form-label">Pill Accent Color</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {MED_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: c,
                  border: selectedColor === c ? '2.5px solid #ffffff' : 'none',
                  boxShadow: selectedColor === c ? `0 0 0 2px ${c}` : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Plus size={14} />
            <span>Add Medication</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
