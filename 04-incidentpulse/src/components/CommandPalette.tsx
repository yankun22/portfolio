import React, { useState, useEffect, useRef } from 'react';
import { useIncident } from '../context/IncidentContext';
import {
  Search,
  Activity,
  Kanban,
  Network,
  Radio,
  FileText,
  ShieldCheck,
  RotateCcw,
  History,
  Zap,
  Server,
  AlertCircle,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'INCIDENTS' | 'SERVICES' | 'CHAOS' | 'NAVIGATION';
  icon: React.FC<{ size?: number; color?: string }>;
  iconColor?: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    incidents,
    services,
    acknowledgeIncident,
    changeSeverity,
    moveIncidentStatus,
    restartService,
    triggerRollback,
    triggerAnomaly,
    healAllServices,
    setActiveTab,
    setSelectedIncident,
    setSelectedService,
  } = useIncident();

  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Build command palette item collection
  const items: PaletteItem[] = [];

  // 1. Active Incidents Actions
  incidents.forEach((inc) => {
    if (inc.status !== 'resolved') {
      if (!inc.acknowledgedAt) {
        items.push({
          id: `ack-${inc.id}`,
          title: `Acknowledge Incident ${inc.id}`,
          subtitle: `${inc.severity} · ${inc.title}`,
          category: 'INCIDENTS',
          icon: ShieldCheck,
          iconColor: '#38bdf8',
          action: () => {
            acknowledgeIncident(inc.id);
            setIsCommandPaletteOpen(false);
          },
        });
      }

      items.push({
        id: `view-${inc.id}`,
        title: `View Incident ${inc.id} Dossier`,
        subtitle: `Status: ${inc.status.toUpperCase()} · ${inc.serviceName}`,
        category: 'INCIDENTS',
        icon: AlertCircle,
        iconColor: inc.severity === 'SEV-1' ? '#ef4444' : '#f59e0b',
        action: () => {
          setSelectedIncident(inc);
          setIsCommandPaletteOpen(false);
        },
      });

      if (inc.severity !== 'SEV-1') {
        items.push({
          id: `escalate-${inc.id}`,
          title: `Escalate ${inc.id} to SEV-1 Critical`,
          subtitle: `Reduces SLA target to 15 minutes and pages lead responders`,
          category: 'INCIDENTS',
          icon: Flame,
          iconColor: '#ef4444',
          action: () => {
            changeSeverity(inc.id, 'SEV-1');
            setIsCommandPaletteOpen(false);
          },
        });
      }

      items.push({
        id: `resolve-${inc.id}`,
        title: `Resolve Incident ${inc.id}`,
        subtitle: `Mark mitigation successful and freeze SLA timer`,
        category: 'INCIDENTS',
        icon: ShieldCheck,
        iconColor: '#10b981',
        action: () => {
          moveIncidentStatus(inc.id, 'resolved');
          setIsCommandPaletteOpen(false);
        },
      });
    }
  });

  // 2. Microservice Operations
  services.forEach((svc) => {
    items.push({
      id: `inspect-${svc.id}`,
      title: `Inspect Service: ${svc.name}`,
      subtitle: `Status: ${svc.status.toUpperCase()} · Latency: ${svc.latencyMs}ms · RPS: ${svc.rps}`,
      category: 'SERVICES',
      icon: Server,
      iconColor: '#06b6d4',
      action: () => {
        setSelectedService(svc);
        setIsCommandPaletteOpen(false);
      },
    });

    items.push({
      id: `restart-${svc.id}`,
      title: `Restart Pods: ${svc.name}`,
      subtitle: `Trigger rolling deployment refresh across ${svc.replicas} replicas`,
      category: 'SERVICES',
      icon: RotateCcw,
      iconColor: '#c084fc',
      action: () => {
        restartService(svc.id);
        setIsCommandPaletteOpen(false);
      },
    });

    items.push({
      id: `rollback-${svc.id}`,
      title: `Trigger Rollback: ${svc.name}`,
      subtitle: `Revert ${svc.version} to previous stable release`,
      category: 'SERVICES',
      icon: History,
      iconColor: '#fbbf24',
      action: () => {
        triggerRollback(svc.id, 'vPreviousStable');
        setIsCommandPaletteOpen(false);
      },
    });
  });

  // 3. Chaos & Simulation
  items.push({
    id: 'chaos-5xx',
    title: 'Chaos: Inject Payments 504 Gateway Flood',
    subtitle: 'Simulates upstream acquirer network drop and 19.8% 5xx error rate',
    category: 'CHAOS',
    icon: Zap,
    iconColor: '#ef4444',
    action: () => {
      triggerAnomaly('anomaly-5xx-payments');
      setIsCommandPaletteOpen(false);
    },
  });

  items.push({
    id: 'chaos-latency',
    title: 'Chaos: Inject Auth JWT Latency Surge (> 1200ms)',
    subtitle: 'Simulates token signature verification lock and thread exhaustion',
    category: 'CHAOS',
    icon: Zap,
    iconColor: '#f59e0b',
    action: () => {
      triggerAnomaly('anomaly-latency-auth');
      setIsCommandPaletteOpen(false);
    },
  });

  items.push({
    id: 'chaos-deadlock',
    title: 'Chaos: Inject PostgreSQL Row Lock Deadlock',
    subtitle: 'Simulates lock contention with connection pool exhaustion',
    category: 'CHAOS',
    icon: Zap,
    iconColor: '#f87171',
    action: () => {
      triggerAnomaly('anomaly-deadlock-postgres');
      setIsCommandPaletteOpen(false);
    },
  });

  items.push({
    id: 'chaos-heal',
    title: 'Self-Heal: Restore All Services to Baseline',
    subtitle: 'Clear all synthetic anomalies and resolve active incidents',
    category: 'CHAOS',
    icon: Sparkles,
    iconColor: '#10b981',
    action: () => {
      healAllServices();
      setIsCommandPaletteOpen(false);
    },
  });

  // 4. Navigation
  items.push(
    {
      id: 'nav-command',
      title: 'Navigate: Command Center Overview',
      subtitle: 'Global reliability metrics, active alert summary, and health score',
      category: 'NAVIGATION',
      icon: Activity,
      iconColor: '#38bdf8',
      action: () => {
        setActiveTab('command-center');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-kanban',
      title: 'Navigate: Incident Triage Kanban Board',
      subtitle: 'Drag-and-drop incident workflow with live SLA countdowns',
      category: 'NAVIGATION',
      icon: Kanban,
      iconColor: '#38bdf8',
      action: () => {
        setActiveTab('kanban');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-topology',
      title: 'Navigate: Service Dependency Topology Mesh',
      subtitle: 'Interactive SVG node graph with live throughput particles',
      category: 'NAVIGATION',
      icon: Network,
      iconColor: '#38bdf8',
      action: () => {
        setActiveTab('topology');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-stream',
      title: 'Navigate: Live Streaming Telemetry Terminal',
      subtitle: 'Real-time WebSocket / SSE log stream and alarm feed',
      category: 'NAVIGATION',
      icon: Radio,
      iconColor: '#38bdf8',
      action: () => {
        setActiveTab('stream');
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-postmortem',
      title: 'Navigate: Post-Mortem & RCA Studio',
      subtitle: 'Interactive 5-whys builder with live Markdown export',
      category: 'NAVIGATION',
      icon: FileText,
      iconColor: '#38bdf8',
      action: () => {
        setActiveTab('post-mortem');
        setIsCommandPaletteOpen(false);
      },
    }
  );

  // Filter items matching query
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Handle Keyboard Navigation (ArrowUp, ArrowDown, Enter, Esc)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsCommandPaletteOpen(false)}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#090e17',
          borderRadius: '14px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(6, 182, 212, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(14, 21, 35, 0.95)',
          }}
        >
          <Search size={18} color="#06b6d4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, incident ID, or service name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '3px 6px',
              borderRadius: '4px',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '420px',
            overflowY: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.825rem' }}>
              No commands or incidents found matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(6, 182, 212, 0.16)' : 'transparent',
                    border: isSelected ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.iconColor || '#94a3b8',
                      }}
                    >
                      <Icon size={16} color={item.iconColor} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: isSelected ? '#94a3b8' : 'var(--text-dim)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={14} color="#06b6d4" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hotkey Legend */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(6, 9, 14, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: 'var(--text-dim)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono">IncidentPulse SRE Hub</span>
        </div>
      </div>
    </div>
  );
};
