import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import type { IncidentStatus } from '../types/incident';
import { IncidentCard } from './IncidentCard';
import {
  Search,
  Filter,
  Plus,
  SearchCode,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const KanbanBoard: React.FC<{ onOpenDeclareModal: () => void }> = ({ onOpenDeclareModal }) => {
  const { incidents, moveIncidentStatus } = useIncident();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [dragOverColumn, setDragOverColumn] = useState<IncidentStatus | null>(null);

  const columns: Array<{
    id: IncidentStatus;
    title: string;
    description: string;
    color: string;
    icon: React.FC<{ size?: number; color?: string }>;
  }> = [
    {
      id: 'investigating',
      title: 'Investigating',
      description: 'Telemetry triage & on-call triage',
      color: '#ef4444',
      icon: AlertCircle,
    },
    {
      id: 'identified',
      title: 'Identified',
      description: 'Root cause isolated & plan formed',
      color: '#f59e0b',
      icon: SearchCode,
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      description: 'Mitigation deployed / recovery verification',
      color: '#38bdf8',
      icon: Eye,
    },
    {
      id: 'resolved',
      title: 'Resolved',
      description: 'Incident mitigated & SLA stopped',
      color: '#10b981',
      icon: CheckCircle,
    },
  ];

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'ALL' || inc.severity === selectedSeverity;
    const matchesService = selectedService === 'ALL' || inc.serviceId === selectedService;

    return matchesSearch && matchesSeverity && matchesService;
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, colId: IncidentStatus) => {
    e.preventDefault();
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, colId: IncidentStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const incidentId = e.dataTransfer.getData('text/plain');
    if (incidentId) {
      moveIncidentStatus(incidentId, colId);
    }
  };

  // Get distinct service IDs for dropdown filter
  const distinctServices = Array.from(new Set(incidents.map((i) => i.serviceId)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & Filter Toolbar */}
      <div
        className="card-glass"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              position: 'relative',
              flex: 1,
              maxWidth: '360px',
            }}
          >
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Filter incidents by ID, title, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: 'rgba(6, 9, 14, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.825rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Severity Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              style={{
                background: 'rgba(6, 9, 14, 0.7)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '7px 10px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="ALL">All Severities</option>
              <option value="SEV-1">SEV-1 Critical</option>
              <option value="SEV-2">SEV-2 High</option>
              <option value="SEV-3">SEV-3 Medium</option>
              <option value="SEV-4">SEV-4 Low</option>
            </select>
          </div>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            style={{
              background: 'rgba(6, 9, 14, 0.7)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '7px 10px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Services</option>
            {distinctServices.map((svcId) => (
              <option key={svcId} value={svcId}>
                {svcId}
              </option>
            ))}
          </select>
        </div>

        {/* Declare Incident Button */}
        <button
          onClick={onOpenDeclareModal}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <Plus size={15} />
          <span>Declare Incident</span>
        </button>
      </div>

      {/* Kanban 4 Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {columns.map((col) => {
          const colIncidents = filteredIncidents.filter((i) => i.status === col.id);
          const isOver = dragOverColumn === col.id;
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{
                background: isOver ? 'rgba(6, 182, 212, 0.08)' : 'rgba(10, 15, 24, 0.75)',
                border: isOver ? '1.5px dashed #06b6d4' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                minHeight: '620px',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Column Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `2px solid ${col.color}`, paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ColIcon size={16} color={col.color} />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                    {col.title}
                  </span>
                </div>
                <span
                  className="font-mono"
                  style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {colIncidents.length}
                </span>
              </div>

              {/* Column Description */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '-4px' }}>
                {col.description}
              </div>

              {/* Incident Cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                {colIncidents.length === 0 ? (
                  <div
                    style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: 'var(--text-dim)',
                      fontSize: '0.78rem',
                      border: '1px dashed rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                    }}
                  >
                    No incidents in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colIncidents.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
