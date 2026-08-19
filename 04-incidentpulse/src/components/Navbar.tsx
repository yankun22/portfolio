import React from 'react';
import { useIncident } from '../context/IncidentContext';
import type { ViewTab } from '../types/incident';
import {
  Activity,
  Kanban,
  Radio,
  Network,
  FileText,
  Command,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  onOpenChaosModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChaosModal }) => {
  const {
    activeTab,
    setActiveTab,
    setIsCommandPaletteOpen,
    isStreamPaused,
    setIsStreamPaused,
    streamSpeed,
    setStreamSpeed,
    isMuted,
    toggleMute,
    incidents,
  } = useIncident();

  const activeSev1 = incidents.filter((i) => i.severity === 'SEV-1' && i.status !== 'resolved').length;
  const activeSev2 = incidents.filter((i) => i.severity === 'SEV-2' && i.status !== 'resolved').length;
  const totalActive = activeSev1 + activeSev2;

  const navItems: { id: ViewTab; label: string; icon: React.ComponentType<{ size?: number; color?: string; className?: string }> }[] = [
    { id: 'command-center', label: 'Command Center', icon: Activity },
    { id: 'kanban', label: 'Triage Kanban', icon: Kanban },
    { id: 'topology', label: 'Service Topology', icon: Network },
    { id: 'stream', label: 'Live Telemetry', icon: Radio },
    { id: 'post-mortem', label: 'Post-Mortem Studio', icon: FileText },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(8, 13, 21, 0.88)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1680px',
          margin: '0 auto',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Brand & Status Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.25)',
              position: 'relative',
            }}
          >
            <Activity size={20} color="#06b6d4" />
            {totalActive > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 8px #ef4444',
                  animation: 'pulse-ring 1.5s infinite',
                }}
              />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                Incident<span style={{ color: '#06b6d4' }}>Pulse</span>
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: totalActive > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: totalActive > 0 ? '#ef4444' : '#10b981',
                  border: `1px solid ${totalActive > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                  fontWeight: 700,
                }}
              >
                {totalActive > 0 ? `${totalActive} ACTIVE ALERTS` : 'ALL SYSTEMS STABLE'}
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '-2px' }}>
              SRE Reliability & Incident Operations Command
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(12, 18, 29, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '7px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  background: isActive ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(14, 116, 144, 0.25) 100%)' : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid #06b6d4' : '2px solid transparent',
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : 'currentColor'} />
                <span>{item.label}</span>
                {item.id === 'kanban' && totalActive > 0 && (
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      background: '#ef4444',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    {totalActive}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Stream telemetry controller */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(12, 18, 29, 0.7)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setIsStreamPaused(!isStreamPaused)}
              title={isStreamPaused ? 'Resume live WebSocket stream' : 'Pause live stream'}
              style={{
                background: 'none',
                border: 'none',
                color: isStreamPaused ? '#f59e0b' : '#10b981',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isStreamPaused ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: isStreamPaused ? '#f59e0b' : '#10b981' }}>
              {isStreamPaused ? 'STREAM PAUSED' : 'LIVE FEED'}
            </span>
            <select
              value={streamSpeed}
              onChange={(e) => setStreamSpeed(Number(e.target.value))}
              style={{
                background: 'rgba(0,0,0,0.3)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '0.7rem',
                padding: '2px 4px',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value={1000}>1.0s</option>
              <option value={2500}>2.5s</option>
              <option value={5000}>5.0s</option>
            </select>
          </div>

          {/* Sound toggle */}
          <button
            onClick={toggleMute}
            className="btn btn-sm"
            title={isMuted ? 'Unmute alert tones' : 'Mute alert tones'}
            style={{
              color: isMuted ? 'var(--text-dim)' : '#06b6d4',
              borderColor: isMuted ? 'var(--border-subtle)' : 'rgba(6, 182, 212, 0.3)',
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Chaos Trigger button */}
          <button
            onClick={onOpenChaosModal}
            className="btn btn-sm btn-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={14} />
            <span>Chaos Engine</span>
          </button>

          {/* Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="btn btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(6, 182, 212, 0.1)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              color: '#38bdf8',
            }}
          >
            <Command size={13} />
            <span style={{ fontSize: '0.78rem' }}>Ctrl+K</span>
          </button>
        </div>
      </div>
    </header>
  );
};
