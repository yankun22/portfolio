import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import type { IncidentSeverity, RootCauseCategory } from '../types/incident';
import { INITIAL_ASSIGNEES } from '../data/mockData';
import {
  X,
  Plus,
  ShieldAlert,
} from 'lucide-react';

export const DeclareIncidentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { services, createIncident } = useIncident();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<IncidentSeverity>('SEV-2');
  const [serviceId, setServiceId] = useState<string>(services[0]?.id || 'payments-engine');
  const [impactedUsers, setImpactedUsers] = useState<number>(1500);
  const [rootCauseCategory, setRootCauseCategory] = useState<RootCauseCategory>('infrastructure_failure');
  const [rootCauseSummary, setRootCauseSummary] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createIncident({
      title: title.trim(),
      description: description.trim() || 'Manual incident declared by SRE on-call lead.',
      severity,
      serviceId,
      impactedUsers: Number(impactedUsers) || 500,
      assignee: INITIAL_ASSIGNEES[0],
      rootCauseCategory,
      rootCauseSummary: rootCauseSummary.trim() || 'Initial triage in progress.',
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '580px',
          background: '#0d1320',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(18, 25, 40, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={18} color="#06b6d4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Declare New SRE Incident</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Page response teams and start automated SLA tracking clock.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              INCIDENT TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elevated 500 errors on Cart Checkout API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(6, 9, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SEVERITY TIER
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="SEV-1">SEV-1 Critical (15m SLA)</option>
                <option value="SEV-2">SEV-2 High (60m SLA)</option>
                <option value="SEV-3">SEV-3 Medium (4h SLA)</option>
                <option value="SEV-4">SEV-4 Low (24h SLA)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                TARGET SERVICE
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {services.map((svc) => (
                  <option key={svc.id} value={svc.id}>
                    {svc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              INCIDENT DESCRIPTION & SYMPTOMS
            </label>
            <textarea
              rows={3}
              placeholder="Describe telemetry anomalies, user symptoms, or error messages observed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(6, 9, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.825rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ESTIMATED IMPACTED USERS
              </label>
              <input
                type="number"
                value={impactedUsers}
                onChange={(e) => setImpactedUsers(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ROOT CAUSE CATEGORY
              </label>
              <select
                value={rootCauseCategory}
                onChange={(e) => setRootCauseCategory(e.target.value as RootCauseCategory)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                <option value="infrastructure_failure">Infrastructure Failure</option>
                <option value="code_regression">Code Regression</option>
                <option value="third_party">3rd Party Dependency Outage</option>
                <option value="traffic_spike">Traffic Spike / Capacity</option>
                <option value="db_deadlock">Database Lock Contention</option>
                <option value="config_drift">Configuration Drift</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              INITIAL ROOT CAUSE FORENSIC SUMMARY
            </label>
            <input
              type="text"
              placeholder="e.g. Deadlock detected on row lock in inventory_reservations table"
              value={rootCauseSummary}
              onChange={(e) => setRootCauseSummary(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(6, 9, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary" style={{ gap: '6px' }}>
              <Plus size={14} /> Declare & Start SLA Clock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
