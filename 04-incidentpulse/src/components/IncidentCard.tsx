import React, { useState, useEffect } from 'react';
import type { Incident, IncidentStatus } from '../types/incident';
import { useIncident } from '../context/IncidentContext';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  ShieldCheck,
} from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onDragStart }) => {
  const { setSelectedIncident, acknowledgeIncident, moveIncidentStatus } = useIncident();
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isBreached, setIsBreached] = useState<boolean>(false);

  // Compute live SLA countdown timer
  useEffect(() => {
    const calculateSLA = () => {
      const createdTime = new Date(incident.createdAt).getTime();
      const slaTotalMs = incident.slaMinutes * 60 * 1000;
      const deadlineTime = createdTime + slaTotalMs;

      if (incident.status === 'resolved' && incident.resolvedAt) {
        const resolvedTime = new Date(incident.resolvedAt).getTime();
        const durationSeconds = Math.round((resolvedTime - createdTime) / 1000);
        const breached = resolvedTime > deadlineTime;
        setIsBreached(breached);
        setRemainingSeconds(durationSeconds);
        return;
      }

      const now = Date.now();
      const diffMs = deadlineTime - now;
      const secRemaining = Math.round(diffMs / 1000);

      if (secRemaining <= 0) {
        setIsBreached(true);
        setRemainingSeconds(Math.abs(secRemaining));
      } else {
        setIsBreached(false);
        setRemainingSeconds(secRemaining);
      }
    };

    calculateSLA();
    if (incident.status !== 'resolved') {
      const interval = setInterval(calculateSLA, 1000);
      return () => clearInterval(interval);
    }
  }, [incident]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const m = mins % 60;
      return `${hours}h ${m}m ${s}s`;
    }
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const getSeverityBadge = () => {
    switch (incident.severity) {
      case 'SEV-1':
        return <span className="badge badge-sev1">SEV-1 CRITICAL</span>;
      case 'SEV-2':
        return <span className="badge badge-sev2">SEV-2 HIGH</span>;
      case 'SEV-3':
        return <span className="badge badge-sev3">SEV-3 MEDIUM</span>;
      case 'SEV-4':
        return <span className="badge badge-sev4">SEV-4 LOW</span>;
    }
  };

  const getSlaDisplay = () => {
    if (incident.status === 'resolved') {
      if (isBreached) {
        return (
          <span className="sla-badge sla-breached">
            <AlertCircle size={11} /> SLA Breached ({formatTime(remainingSeconds)})
          </span>
        );
      }
      return (
        <span className="sla-badge sla-met">
          <CheckCircle2 size={11} /> Resolved in {formatTime(remainingSeconds)}
        </span>
      );
    }

    if (isBreached) {
      return (
        <span className="sla-badge sla-breached">
          <AlertCircle size={11} /> SLA Breached by +{formatTime(remainingSeconds)}
        </span>
      );
    }

    const slaWarning = remainingSeconds < incident.slaMinutes * 60 * 0.25;
    return (
      <span className={`sla-badge ${slaWarning ? 'sla-warning' : 'sla-normal'}`}>
        <Clock size={11} /> {formatTime(remainingSeconds)} remaining
      </span>
    );
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, incident.id)}
      onClick={() => setSelectedIncident(incident)}
      style={{
        background: 'rgba(14, 21, 35, 0.9)',
        border: incident.severity === 'SEV-1' && incident.status !== 'resolved'
          ? '1.5px solid rgba(239, 68, 68, 0.45)'
          : '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '14px',
        cursor: 'grab',
        boxShadow: incident.severity === 'SEV-1' && incident.status !== 'resolved'
          ? '0 4px 16px rgba(239, 68, 68, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = incident.severity === 'SEV-1' && incident.status !== 'resolved'
          ? 'rgba(239, 68, 68, 0.45)'
          : 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top row: ID, Drag icon, Severity Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GripVertical size={14} color="var(--text-dim)" />
          <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
            {incident.id}
          </span>
        </div>
        {getSeverityBadge()}
      </div>

      {/* Incident Title */}
      <h4
        style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: '#f8fafc',
          lineHeight: 1.35,
        }}
      >
        {incident.title}
      </h4>

      {/* Affected Service Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span
          className="font-mono"
          style={{
            fontSize: '0.68rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {incident.serviceName}
        </span>
        {incident.impactedUsers > 0 && (
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(245, 158, 11, 0.08)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            👥 ~{incident.impactedUsers.toLocaleString()} users
          </span>
        )}
      </div>

      {/* SLA Timer Clock */}
      <div>{getSlaDisplay()}</div>

      {/* Bottom Bar: Assignee, Quick Acknowledge, Move Dropdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '8px',
          marginTop: '2px',
        }}
      >
        {/* Assignee Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`Assigned to: ${incident.assignee.name} (${incident.assignee.role})`}>
          <img
            src={incident.assignee.avatar}
            alt={incident.assignee.name}
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            {incident.assignee.name.split(' ')[0]}
          </span>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
          {!incident.acknowledgedAt && incident.status !== 'resolved' && (
            <button
              onClick={() => acknowledgeIncident(incident.id)}
              className="btn btn-sm"
              style={{ padding: '2px 7px', fontSize: '0.68rem', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.3)' }}
              title="Acknowledge incident on-call"
            >
              <ShieldCheck size={12} /> Ack
            </button>
          )}

          {/* Quick status dropdown */}
          <select
            value={incident.status}
            onChange={(e) => moveIncidentStatus(incident.id, e.target.value as IncidentStatus)}
            style={{
              background: 'rgba(8, 13, 21, 0.9)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '0.68rem',
              padding: '2px 4px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="investigating">Investigating</option>
            <option value="identified">Identified</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
};
