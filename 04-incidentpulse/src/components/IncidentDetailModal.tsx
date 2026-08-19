import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import type { IncidentStatus, IncidentSeverity, TimelineEventType } from '../types/incident';
import {
  X,
  ShieldCheck,
  Send,
  FileText,
} from 'lucide-react';

export const IncidentDetailModal: React.FC = () => {
  const {
    selectedIncident,
    setSelectedIncident,
    acknowledgeIncident,
    changeSeverity,
    moveIncidentStatus,
    addTimelineEvent,
    setActiveTab,
    setActivePostMortem,
  } = useIncident();

  const [newUpdateMessage, setNewUpdateMessage] = useState<string>('');
  const [newUpdateType, setNewUpdateType] = useState<TimelineEventType>('investigation');

  if (!selectedIncident) return null;

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateMessage.trim()) return;

    addTimelineEvent(selectedIncident.id, newUpdateMessage.trim(), newUpdateType);
    setNewUpdateMessage('');
  };

  const handleOpenPostMortem = () => {
    setActivePostMortem({
      id: `PM-${selectedIncident.id}`,
      incidentId: selectedIncident.id,
      title: selectedIncident.title,
      summary: selectedIncident.description,
      leadInvestigator: selectedIncident.assignee.name,
      impactDurationMinutes: Math.max(15, Math.round((Date.now() - new Date(selectedIncident.createdAt).getTime()) / 60000)),
      revenueImpactEstimate: selectedIncident.severity === 'SEV-1' ? '$24,500' : '$4,200',
      userImpactSummary: `Approximately ${selectedIncident.impactedUsers.toLocaleString()} users affected across ${selectedIncident.region}.`,
      detectionMechanism: selectedIncident.timeline[0]?.message || 'Automated metric alert.',
      rootCause5Whys: [
        'Why did the service fail? ' + selectedIncident.rootCauseSummary,
        'Why was this not caught in staging? Missing high-concurrency load testing suite for this code path.',
        'Why did timeout cascade occur? Circuit breaker failure threshold was configured too leniently.',
      ],
      timeline: selectedIncident.timeline,
      actionItems: [
        {
          id: 'ai-1',
          description: `Add automated synthetic test for ${selectedIncident.serviceName} degradation threshold`,
          owner: selectedIncident.assignee.name,
          priority: 'P1',
          status: 'todo',
          dueDate: '2026-08-25',
        },
        {
          id: 'ai-2',
          description: 'Tune circuit breaker timeout and connection pool maximums',
          owner: 'Infrastructure Team',
          priority: 'P0',
          status: 'in_progress',
          dueDate: '2026-08-22',
        },
      ],
      lessonsLearned: {
        wentWell: [
          'Alert manager detected latency threshold breach within 90 seconds.',
          'On-call engineer acknowledged and mobilized response in < 5 minutes.',
        ],
        wentPoorly: [
          'Runbook link for connection pool tuning was outdated.',
          'Cross-region failover took longer than target 3 minutes.',
        ],
        whereWeGotLucky: [
          'Incident occurred outside peak shopping rush hour.',
          'Database primary replica remained responsive and prevented data corruption.',
        ],
      },
      publishedAt: new Date().toISOString(),
    });

    setSelectedIncident(null);
    setActiveTab('post-mortem');
  };

  const getSeverityBadge = () => {
    switch (selectedIncident.severity) {
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

  return (
    <div className="modal-backdrop" onClick={() => setSelectedIncident(null)}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          background: '#0d1422',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'rgba(16, 24, 38, 0.8)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="font-mono" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#38bdf8' }}>
                {selectedIncident.id}
              </span>
              {getSeverityBadge()}
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Status: {selectedIncident.status}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
              {selectedIncident.title}
            </h3>
          </div>

          <button
            onClick={() => setSelectedIncident(null)}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Action Control Bar */}
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(14, 21, 35, 0.9)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Status Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['investigating', 'identified', 'monitoring', 'resolved'] as IncidentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => moveIncidentStatus(selectedIncident.id, st)}
                    className="btn btn-sm"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      background: selectedIncident.status === st ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255,255,255,0.04)',
                      borderColor: selectedIncident.status === st ? '#06b6d4' : 'var(--border-subtle)',
                      color: selectedIncident.status === st ? '#38bdf8' : 'var(--text-secondary)',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY:</span>
              <select
                value={selectedIncident.severity}
                onChange={(e) => changeSeverity(selectedIncident.id, e.target.value as IncidentSeverity)}
                style={{
                  background: 'rgba(6, 9, 14, 0.9)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="SEV-1">SEV-1 Critical (15m SLA)</option>
                <option value="SEV-2">SEV-2 High (60m SLA)</option>
                <option value="SEV-3">SEV-3 Medium (4h SLA)</option>
                <option value="SEV-4">SEV-4 Low (24h SLA)</option>
              </select>
            </div>
          </div>

          {/* Description & Metadata */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
              INCIDENT OVERVIEW
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {selectedIncident.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PRIMARY SERVICE</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                {selectedIncident.serviceName}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>IMPACTED USERS</div>
              <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>
                ~{selectedIncident.impactedUsers.toLocaleString()} users
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INCIDENT COMMANDER</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>
                {selectedIncident.assignee.name}
              </div>
            </div>
          </div>

          {/* Root Cause Hypothesis */}
          <div style={{ padding: '14px', background: 'rgba(16, 24, 38, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
              ROOT CAUSE ANALYSIS (INITIAL FORENSICS)
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              {selectedIncident.rootCauseSummary}
            </p>
          </div>

          {/* Timeline Event Log */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '10px' }}>
              INCIDENT TIMELINE ({selectedIncident.timeline.length} Events)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedIncident.timeline.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    background: 'rgba(12, 18, 29, 0.75)',
                    borderRadius: '8px',
                    borderLeft: item.type === 'resolution' ? '3px solid #10b981' : item.type === 'mitigation' ? '3px solid #06b6d4' : item.type === 'detection' ? '3px solid #ef4444' : '3px solid #f59e0b',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>{item.author}</span>
                      <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        [{item.type}]
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Timeline Event Form */}
            <form onSubmit={handleAddUpdate} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <select
                value={newUpdateType}
                onChange={(e) => setNewUpdateType(e.target.value as TimelineEventType)}
                style={{
                  background: 'rgba(8, 13, 21, 0.9)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  padding: '6px 8px',
                  outline: 'none',
                }}
              >
                <option value="investigation">Investigation</option>
                <option value="mitigation">Mitigation</option>
                <option value="communication">Communication</option>
                <option value="resolution">Resolution</option>
              </select>

              <input
                type="text"
                placeholder="Post on-call timeline update or diagnostic note..."
                value={newUpdateMessage}
                onChange={(e) => setNewUpdateMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: 'rgba(8, 13, 21, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />

              <button type="submit" className="btn btn-sm btn-primary" style={{ gap: '4px' }}>
                <Send size={13} /> Update
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 24, 38, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!selectedIncident.acknowledgedAt && (
              <button
                onClick={() => acknowledgeIncident(selectedIncident.id)}
                className="btn btn-sm"
                style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.3)' }}
              >
                <ShieldCheck size={14} /> Acknowledge On-Call
              </button>
            )}
          </div>

          <button
            onClick={handleOpenPostMortem}
            className="btn btn-sm btn-emerald"
            style={{ gap: '6px' }}
          >
            <FileText size={14} /> Draft Post-Mortem in Studio
          </button>
        </div>
      </div>
    </div>
  );
};
