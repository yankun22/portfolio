import React, { useState } from 'react';
import { IncidentProvider, useIncident } from './context/IncidentContext';
import { Navbar } from './components/Navbar';
import { MetricsHeader } from './components/MetricsHeader';
import { TopologyMap } from './components/TopologyMap';
import { KanbanBoard } from './components/KanbanBoard';
import { IncidentStream } from './components/IncidentStream';
import { PostMortemBuilder } from './components/PostMortemBuilder';
import { ServiceDrawer } from './components/ServiceDrawer';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { CommandPalette } from './components/CommandPalette';
import { ChaosControls } from './components/ChaosControls';
import { DeclareIncidentModal } from './components/DeclareIncidentModal';
import { IncidentCard } from './components/IncidentCard';
import {
  ArrowRight,
  Flame,
  Command,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, setActiveTab, incidents, setIsCommandPaletteOpen } = useIncident();
  const [isChaosOpen, setIsChaosOpen] = useState<boolean>(false);
  const [isDeclareOpen, setIsDeclareOpen] = useState<boolean>(false);

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="app-container">
      {/* Top sticky Navigation */}
      <Navbar onOpenChaosModal={() => setIsChaosOpen(true)} />

      {/* Main Container */}
      <main className="main-content">
        {/* Global SRE Reliability Metric Scorecards */}
        <MetricsHeader />

        {/* Dynamic Tab Views */}
        {activeTab === 'command-center' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Grid: Service Topology Map + Active Triage Queue */}
            <div className="command-center-grid">
              {/* Interactive Service Topology Map */}
              <TopologyMap />

              {/* Active Incident Triage Feed & Quick Actions */}
              <div className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={18} color="#ef4444" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                      Active Triage Queue
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab('kanban')}
                    className="btn btn-sm"
                    style={{ fontSize: '0.72rem', gap: '4px' }}
                  >
                    <span>Full Kanban</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '560px', overflowY: 'auto' }}>
                  {activeIncidents.length === 0 ? (
                    <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.825rem' }}>
                      🎉 Zero active incidents. All microservices operating nominally within SLA.
                    </div>
                  ) : (
                    activeIncidents.map((inc) => (
                      <IncidentCard key={inc.id} incident={inc} />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom: Live Telemetry Stream preview */}
            <IncidentStream />
          </div>
        )}

        {activeTab === 'kanban' && (
          <KanbanBoard onOpenDeclareModal={() => setIsDeclareOpen(true)} />
        )}

        {activeTab === 'topology' && (
          <TopologyMap />
        )}

        {activeTab === 'stream' && (
          <IncidentStream />
        )}

        {activeTab === 'post-mortem' && (
          <PostMortemBuilder />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ServiceDrawer />
      <IncidentDetailModal />
      <CommandPalette />
      <ChaosControls isOpen={isChaosOpen} onClose={() => setIsChaosOpen(false)} />
      <DeclareIncidentModal isOpen={isDeclareOpen} onClose={() => setIsDeclareOpen(false)} />

      {/* Mobile-only Command Palette FAB (⌘K replacement for touch screens) */}
      <button
        className="command-fab"
        onClick={() => setIsCommandPaletteOpen(true)}
        title="Open Command Palette"
        aria-label="Open Command Palette"
      >
        <Command size={22} />
      </button>
    </div>
  );
};

export function App() {
  return (
    <IncidentProvider>
      <DashboardContent />
    </IncidentProvider>
  );
}

export default App;
