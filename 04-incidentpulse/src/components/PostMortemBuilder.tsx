import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import type { PostMortem, ActionItem } from '../types/incident';
import { generatePostMortemMarkdown } from '../utils/markdownGenerator';
import {
  FileText,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostMortemBuilder: React.FC = () => {
  const { incidents, activePostMortem, savePostMortem } = useIncident();

  // Default selected incident or activePostMortem
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    activePostMortem?.incidentId || incidents[0]?.id || ''
  );

  const [postMortemState, setPostMortemState] = useState<PostMortem>(() => {
    if (activePostMortem) return activePostMortem;

    const inc = incidents[0];
    const duration = inc ? Math.max(15, Math.round((Date.now() - new Date(inc.createdAt).getTime()) / 60000)) : 45;

    return {
      id: `PM-${inc?.id || 'INC-1000'}`,
      incidentId: inc?.id || 'INC-1000',
      title: inc?.title || 'System Outage Post-Mortem',
      summary: inc?.description || 'Service degradation during traffic peak.',
      leadInvestigator: inc?.assignee.name || 'Elena Rostova',
      impactDurationMinutes: duration,
      revenueImpactEstimate: '$18,500',
      userImpactSummary: `Approximately ${inc?.impactedUsers || 1200} users experienced elevated latency or 5xx errors.`,
      detectionMechanism: inc?.timeline[0]?.message || 'Datadog metric alarm breach',
      rootCause5Whys: [
        'Why did the service fail? Connection pool exhaustion in primary database.',
        'Why did connections exhaust? Unindexed full table scan held exclusive table lock.',
        'Why was query run without index? Schema migration missed adding composite index on active partition.',
        'Why was index missing in staging? Staging data volume was too small to trigger query planner full scan.',
        'Why was staging volume small? Synthetic data generator script was not updated after v3 schema change.',
      ],
      timeline: inc?.timeline || [],
      actionItems: [
        {
          id: 'ai-1',
          description: 'Deploy composite index migration for active table partitions',
          owner: 'David Okafor',
          priority: 'P0',
          status: 'completed',
          dueDate: '2026-08-20',
        },
        {
          id: 'ai-2',
          description: 'Implement mandatory database query timeout (statement_timeout = 2500ms)',
          owner: 'Elena Rostova',
          priority: 'P1',
          status: 'in_progress',
          dueDate: '2026-08-24',
        },
        {
          id: 'ai-3',
          description: 'Upgrade staging synthetic test dataset to match 10M record production profile',
          owner: 'Marcus Chen',
          priority: 'P2',
          status: 'todo',
          dueDate: '2026-08-30',
        },
      ],
      lessonsLearned: {
        wentWell: [
          'Incident was acknowledged within 3 minutes of alarm trigger.',
          'Topology map accurately identified downstream connection pool saturation.',
        ],
        wentPoorly: [
          'Database failover took 4 minutes instead of targeted 30 seconds.',
          'Communication channel updates lagged by 10 minutes.',
        ],
        whereWeGotLucky: [
          'Secondary read replica remained unaffected and served read queries.',
          'No financial transactions or ledger entries were corrupted.',
        ],
      },
      publishedAt: new Date().toISOString(),
    };
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [published, setPublished] = useState<boolean>(false);
  const [newWhy, setNewWhy] = useState<string>('');
  const [newActionItemDesc, setNewActionItemDesc] = useState<string>('');
  const [newActionItemOwner, setNewActionItemOwner] = useState<string>('');
  const [newActionItemPri, setNewActionItemPri] = useState<'P0' | 'P1' | 'P2'>('P1');

  // When incident selection changes, auto-populate builder
  const handleSelectIncident = (incId: string) => {
    setSelectedIncidentId(incId);
    const inc = incidents.find((i) => i.id === incId);
    if (!inc) return;

    const duration = Math.max(15, Math.round((Date.now() - new Date(inc.createdAt).getTime()) / 60000));

    setPostMortemState({
      id: `PM-${inc.id}`,
      incidentId: inc.id,
      title: inc.title,
      summary: inc.description,
      leadInvestigator: inc.assignee.name,
      impactDurationMinutes: duration,
      revenueImpactEstimate: inc.severity === 'SEV-1' ? '$32,000' : inc.severity === 'SEV-2' ? '$12,500' : '$2,400',
      userImpactSummary: `Approximately ${inc.impactedUsers.toLocaleString()} active users experienced disruption in ${inc.region}.`,
      detectionMechanism: inc.timeline[0]?.message || 'Automated metric alert.',
      rootCause5Whys: [
        `Why did the incident occur? ${inc.rootCauseSummary}`,
        'Why was the error rate elevated? Downstream microservices timed out waiting on response.',
        'Why was mitigation delayed? Diagnostic triage required manual log query correlation.',
      ],
      timeline: inc.timeline,
      actionItems: [
        {
          id: 'ai-' + Date.now() + '-1',
          description: `Add automated synthetic canary test for ${inc.serviceName}`,
          owner: inc.assignee.name,
          priority: 'P0',
          status: 'in_progress',
          dueDate: '2026-08-22',
        },
        {
          id: 'ai-' + Date.now() + '-2',
          description: 'Update alerting thresholds and runbook documentation',
          owner: 'SRE On-Call Team',
          priority: 'P1',
          status: 'todo',
          dueDate: '2026-08-28',
        },
      ],
      lessonsLearned: {
        wentWell: ['Automated alarms triggered within 2 minutes of anomaly onset.'],
        wentPoorly: ['Runbook was missing step for graceful pod drain.'],
        whereWeGotLucky: ['Off-peak traffic minimized impacted user blast radius.'],
      },
      publishedAt: new Date().toISOString(),
    });
  };

  const selectedIncident = incidents.find((i) => i.id === postMortemState.incidentId);
  const markdownContent = generatePostMortemMarkdown(postMortemState, selectedIncident);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `postmortem-${postMortemState.incidentId.toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePublish = () => {
    savePostMortem(postMortemState);
    setPublished(true);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // ignore
    }
    setTimeout(() => setPublished(false), 3000);
  };

  const handleAddWhy = () => {
    if (!newWhy.trim()) return;
    setPostMortemState((prev) => ({
      ...prev,
      rootCause5Whys: [...prev.rootCause5Whys, newWhy.trim()],
    }));
    setNewWhy('');
  };

  const handleRemoveWhy = (idx: number) => {
    setPostMortemState((prev) => ({
      ...prev,
      rootCause5Whys: prev.rootCause5Whys.filter((_, i) => i !== idx),
    }));
  };

  const handleAddActionItem = () => {
    if (!newActionItemDesc.trim()) return;
    const newItem: ActionItem = {
      id: 'ai-' + Date.now(),
      description: newActionItemDesc.trim(),
      owner: newActionItemOwner.trim() || 'SRE Team',
      priority: newActionItemPri,
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };
    setPostMortemState((prev) => ({
      ...prev,
      actionItems: [...prev.actionItems, newItem],
    }));
    setNewActionItemDesc('');
    setNewActionItemOwner('');
  };

  const toggleActionItemStatus = (id: string) => {
    setPostMortemState((prev) => ({
      ...prev,
      actionItems: prev.actionItems.map((item) =>
        item.id === id ? { ...item, status: item.status === 'completed' ? 'todo' : 'completed' } : item
      ),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Export Toolbar */}
      <div
        className="card-glass"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Incident Post-Mortem & RCA Studio
              </h2>
              <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                Markdown & JSON Export
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Generate comprehensive root-cause analysis reports, auto-populate timelines, and manage remediation action items.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Incident Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Load Incident:</span>
            <select
              value={selectedIncidentId}
              onChange={(e) => handleSelectIncident(e.target.value)}
              style={{
                background: 'rgba(6, 9, 14, 0.8)',
                color: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} - {inc.title.substring(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleCopy} className="btn btn-sm" style={{ gap: '6px' }}>
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>

          <button onClick={handleDownload} className="btn btn-sm" style={{ gap: '6px' }}>
            <Download size={14} />
            <span>Download .md</span>
          </button>

          <button onClick={handlePublish} className="btn btn-sm btn-emerald" style={{ gap: '6px' }}>
            {published ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
            <span>{published ? 'Published!' : 'Publish Post-Mortem'}</span>
          </button>
        </div>
      </div>

      {/* Split View: Left = Builder Form, Right = Live Markdown Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Interactive Form Builder */}
        <div className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={16} /> 1. Report Metadata & Executive Summary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                POST-MORTEM TITLE
              </label>
              <input
                type="text"
                value={postMortemState.title}
                onChange={(e) => setPostMortemState({ ...postMortemState, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                LEAD INVESTIGATOR
              </label>
              <input
                type="text"
                value={postMortemState.leadInvestigator}
                onChange={(e) => setPostMortemState({ ...postMortemState, leadInvestigator: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                IMPACT DURATION (MINUTES)
              </label>
              <input
                type="number"
                value={postMortemState.impactDurationMinutes}
                onChange={(e) => setPostMortemState({ ...postMortemState, impactDurationMinutes: Number(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ESTIMATED REVENUE IMPACT
              </label>
              <input
                type="text"
                value={postMortemState.revenueImpactEstimate}
                onChange={(e) => setPostMortemState({ ...postMortemState, revenueImpactEstimate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'rgba(6, 9, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              EXECUTIVE SUMMARY
            </label>
            <textarea
              rows={3}
              value={postMortemState.summary}
              onChange={(e) => setPostMortemState({ ...postMortemState, summary: e.target.value })}
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

          {/* 5-Whys Root Cause Analysis */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <HelpCircle size={16} /> 2. Root Cause Analysis (5-Whys Method)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {postMortemState.rootCause5Whys.map((why, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', minWidth: '55px' }}>
                    Why #{idx + 1}:
                  </span>
                  <input
                    type="text"
                    value={why}
                    onChange={(e) => {
                      const updated = [...postMortemState.rootCause5Whys];
                      updated[idx] = e.target.value;
                      setPostMortemState({ ...postMortemState, rootCause5Whys: updated });
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      background: 'rgba(6, 9, 14, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleRemoveWhy(idx)}
                    className="btn btn-sm"
                    style={{ padding: '6px', color: '#ef4444' }}
                    title="Remove why step"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  placeholder="Add another root-cause Why question/answer..."
                  value={newWhy}
                  onChange={(e) => setNewWhy(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddWhy()}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    background: 'rgba(6, 9, 14, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button onClick={handleAddWhy} className="btn btn-sm" style={{ gap: '4px' }}>
                  <Plus size={13} /> Add Why
                </button>
              </div>
            </div>
          </div>

          {/* Action Items / Remediation Tracker */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <CheckCircle2 size={16} /> 3. Preventive Action Items ({postMortemState.actionItems.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {postMortemState.actionItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: 'rgba(12, 18, 29, 0.7)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.status === 'completed'}
                    onChange={() => toggleActionItemStatus(item.id)}
                    style={{ cursor: 'pointer', accentColor: '#10b981' }}
                  />
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      background: item.priority === 'P0' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: item.priority === 'P0' ? '#ef4444' : '#fbbf24',
                    }}
                  >
                    {item.priority}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: '0.8rem',
                      color: item.status === 'completed' ? 'var(--text-muted)' : '#f8fafc',
                      textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                    }}
                  >
                    {item.description}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    @{item.owner}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.dueDate}
                  </span>
                </div>
              ))}

              {/* Add Action Item Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px auto', gap: '8px', marginTop: '6px' }}>
                <select
                  value={newActionItemPri}
                  onChange={(e) => setNewActionItemPri(e.target.value as 'P0' | 'P1' | 'P2')}
                  style={{
                    background: 'rgba(6, 9, 14, 0.8)',
                    color: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '6px',
                    fontSize: '0.75rem',
                    outline: 'none',
                  }}
                >
                  <option value="P0">P0 Blocker</option>
                  <option value="P1">P1 High</option>
                  <option value="P2">P2 Medium</option>
                </select>

                <input
                  type="text"
                  placeholder="Action item description..."
                  value={newActionItemDesc}
                  onChange={(e) => setNewActionItemDesc(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(6, 9, 14, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />

                <input
                  type="text"
                  placeholder="Owner (@name)"
                  value={newActionItemOwner}
                  onChange={(e) => setNewActionItemOwner(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    background: 'rgba(6, 9, 14, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />

                <button onClick={handleAddActionItem} className="btn btn-sm btn-primary">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Rendered Markdown Preview */}
        <div className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Live Markdown Preview
            </h3>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {markdownContent.length} bytes · GitHub Flavored Markdown
            </span>
          </div>

          <pre
            className="font-mono"
            style={{
              height: '740px',
              background: '#06090e',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              overflowY: 'auto',
              fontSize: '0.75rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
