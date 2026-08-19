import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type {
  ServiceNode,
  Incident,
  IncidentSeverity,
  IncidentStatus,
  LogEvent,
  PostMortem,
  ViewTab,
  TimelineEventType,
} from '../types/incident';
import { INITIAL_SERVICES, INITIAL_INCIDENTS, INITIAL_LOG_EVENTS, ANOMALY_PRESETS, INITIAL_ASSIGNEES } from '../data/mockData';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface IncidentContextType {
  services: ServiceNode[];
  incidents: Incident[];
  logEvents: LogEvent[];
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  selectedService: ServiceNode | null;
  setSelectedService: (service: ServiceNode | null) => void;
  postMortems: PostMortem[];
  activePostMortem: PostMortem | null;
  setActivePostMortem: (pm: PostMortem | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isStreamPaused: boolean;
  setIsStreamPaused: (paused: boolean) => void;
  streamSpeed: number; // in milliseconds interval
  setStreamSpeed: (speed: number) => void;
  isMuted: boolean;
  toggleMute: () => void;

  // Actions
  acknowledgeIncident: (id: string, author?: string) => void;
  changeSeverity: (id: string, severity: IncidentSeverity) => void;
  moveIncidentStatus: (id: string, status: IncidentStatus, author?: string) => void;
  addTimelineEvent: (id: string, message: string, type: TimelineEventType, author?: string) => void;
  triggerAnomaly: (presetId: string) => void;
  triggerRollback: (serviceId: string, version?: string) => void;
  restartService: (serviceId: string) => void;
  healAllServices: () => void;
  createIncident: (incident: Partial<Incident>) => Incident;
  savePostMortem: (pm: PostMortem) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [logEvents, setLogEvents] = useState<LogEvent[]>(INITIAL_LOG_EVENTS);
  const [activeTab, setActiveTab] = useState<ViewTab>('command-center');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceNode | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [streamSpeed, setStreamSpeed] = useState<number>(2500); // 2.5s
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [postMortems, setPostMortems] = useState<PostMortem[]>([]);
  const [activePostMortem, setActivePostMortem] = useState<PostMortem | null>(null);

  const incidentsRef = useRef(incidents);
  incidentsRef.current = incidents;
  const servicesRef = useRef(services);
  servicesRef.current = services;

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundFx.setMuted(next);
      return next;
    });
  }, []);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated SSE / WebSocket streaming telemetry loop
  useEffect(() => {
    if (isStreamPaused) return;

    const interval = setInterval(() => {
      // Pick random service and generate telemetry jitter
      const targetServices = [...servicesRef.current];
      const randomIdx = Math.floor(Math.random() * targetServices.length);
      const svc = targetServices[randomIdx];

      // Add a realistic log event
      const logTemplates: Array<{ level: 'info' | 'warn' | 'error'; msg: (name: string, lat: number) => string; code: number }> = [
        { level: 'info', msg: (name, lat) => `HTTP 200 GET /api/v1/healthcheck [${lat}ms] on ${name}`, code: 200 },
        { level: 'info', msg: (name, lat) => `Processed payload batch size=128 items in ${lat}ms [${name}]`, code: 200 },
        { level: 'info', msg: (_, lat) => `TLS handshake completed (TLS 1.3/ChaCha20-Poly1305) in ${lat}ms`, code: 200 },
        { level: 'info', msg: (name) => `Connection pool stats: 12/50 active, 0 queued on ${name}`, code: 200 },
        { level: 'warn', msg: (name, lat) => `Slow query warning: duration=${lat * 8}ms exceeded 200ms threshold on ${name}`, code: 499 },
        { level: 'error', msg: (name) => `Circuit breaker state probe WARN: consecutive errors on ${name}`, code: 503 },
      ];

      const template = svc.status === 'outage'
        ? { level: 'error' as const, msg: (name: string) => `CRITICAL: Connection refused / upstream 504 on ${name}`, code: 504 }
        : svc.status === 'degraded'
        ? { level: 'warn' as const, msg: (name: string, lat: number) => `High latency alert: p99=${lat * 5}ms on ${name}`, code: 429 }
        : logTemplates[Math.floor(Math.random() * logTemplates.length)];

      const currentLatency = Math.max(2, Math.round(svc.latencyMs + (Math.random() * 8 - 4)));
      const traceId = 'tr-' + Math.random().toString(36).substring(2, 8);

      const newLog: LogEvent = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        timestamp: new Date().toISOString(),
        serviceId: svc.id,
        serviceName: svc.name,
        level: template.level,
        message: template.msg(svc.name, currentLatency),
        statusCode: template.code,
        latency: currentLatency,
        traceId,
      };

      setLogEvents((prev) => [newLog, ...prev.slice(0, 79)]);

      // Natural metric fluctuations for services
      setServices((prev) =>
        prev.map((s) => {
          if (s.status === 'operational') {
            const jitter = (Math.random() - 0.5) * 4;
            const newLatency = Math.max(2, Math.round(s.latencyMs + jitter));
            const newCpu = Math.min(95, Math.max(10, Math.round(s.cpuUsage + (Math.random() - 0.5) * 3)));
            const newRps = Math.max(100, Math.round(s.rps + (Math.random() - 0.5) * 200));
            return { ...s, latencyMs: newLatency, cpuUsage: newCpu, rps: newRps };
          }
          return s;
        })
      );
    }, streamSpeed);

    return () => clearInterval(interval);
  }, [isStreamPaused, streamSpeed]);

  const addTimelineEvent = useCallback((id: string, message: string, type: TimelineEventType, author = 'Current User (SRE On-Call)') => {
    const newEvent = {
      id: 't-' + Date.now(),
      timestamp: new Date().toISOString(),
      author,
      message,
      type,
    };

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          return {
            ...inc,
            timeline: [...inc.timeline, newEvent],
          };
        }
        return inc;
      })
    );
  }, []);

  const acknowledgeIncident = useCallback((id: string, author = 'Current User (SRE On-Call)') => {
    soundFx.playAcknowledgeChime();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const isFirstAck = !inc.acknowledgedAt;
          const updated: Incident = {
            ...inc,
            acknowledgedAt: inc.acknowledgedAt || new Date().toISOString(),
            status: inc.status === 'investigating' ? 'investigating' : inc.status,
            timeline: isFirstAck
              ? [
                  ...inc.timeline,
                  {
                    id: 't-' + Date.now(),
                    timestamp: new Date().toISOString(),
                    author,
                    message: `Incident ${inc.id} acknowledged by ${author}. SLA response target registered.`,
                    type: 'investigation',
                  },
                ]
              : inc.timeline,
          };
          return updated;
        }
        return inc;
      })
    );
  }, []);

  const changeSeverity = useCallback((id: string, severity: IncidentSeverity) => {
    soundFx.playClick();
    const slaMap: Record<IncidentSeverity, number> = {
      'SEV-1': 15,
      'SEV-2': 60,
      'SEV-3': 240,
      'SEV-4': 1440,
    };

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const updated: Incident = {
            ...inc,
            severity,
            slaMinutes: slaMap[severity],
            timeline: [
              ...inc.timeline,
              {
                id: 't-' + Date.now(),
                timestamp: new Date().toISOString(),
                author: 'Current User (SRE On-Call)',
                message: `Incident severity adjusted to ${severity} (SLA target: ${slaMap[severity]}m).`,
                type: 'communication',
              },
            ],
          };
          return updated;
        }
        return inc;
      })
    );
  }, []);

  const moveIncidentStatus = useCallback((id: string, nextStatus: IncidentStatus, author = 'Current User (SRE On-Call)') => {
    const nowIso = new Date().toISOString();
    let isResolved = false;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const prevStatus = inc.status;
          if (prevStatus === nextStatus) return inc;

          const updated: Incident = {
            ...inc,
            status: nextStatus,
            acknowledgedAt: inc.acknowledgedAt || nowIso,
            identifiedAt: nextStatus === 'identified' || nextStatus === 'monitoring' || nextStatus === 'resolved' ? (inc.identifiedAt || nowIso) : inc.identifiedAt,
            mitigatedAt: nextStatus === 'monitoring' || nextStatus === 'resolved' ? (inc.mitigatedAt || nowIso) : inc.mitigatedAt,
            resolvedAt: nextStatus === 'resolved' ? (inc.resolvedAt || nowIso) : null,
            timeline: [
              ...inc.timeline,
              {
                id: 't-' + Date.now(),
                timestamp: nowIso,
                author,
                message: `Incident transitioned status: [${prevStatus.toUpperCase()}] -> [${nextStatus.toUpperCase()}].`,
                type: nextStatus === 'resolved' ? 'resolution' : nextStatus === 'monitoring' ? 'mitigation' : 'investigation',
              },
            ],
          };

          if (nextStatus === 'resolved') {
            isResolved = true;
            // Also restore affected service if no other active incidents for this service
            setServices((svcPrev) =>
              svcPrev.map((s) => {
                if (s.id === inc.serviceId) {
                  return {
                    ...s,
                    status: 'operational',
                    latencyMs: Math.max(12, Math.round(s.latencyMs * 0.3)),
                    p99LatencyMs: Math.max(30, Math.round(s.p99LatencyMs * 0.3)),
                    errorRate: 0.01,
                    cpuUsage: Math.max(25, Math.round(s.cpuUsage * 0.6)),
                  };
                }
                return s;
              })
            );
          }

          return updated;
        }
        return inc;
      })
    );

    if (isResolved) {
      soundFx.playResolvedChime();
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    } else {
      soundFx.playClick();
    }
  }, []);

  const triggerAnomaly = useCallback((presetId: string) => {
    const preset = ANOMALY_PRESETS.find((p) => p.id === presetId) || ANOMALY_PRESETS[0];
    soundFx.playCriticalAlert();

    const newIncId = 'INC-' + Math.floor(1000 + Math.random() * 9000);
    const nowIso = new Date().toISOString();
    const slaMap: Record<IncidentSeverity, number> = { 'SEV-1': 15, 'SEV-2': 60, 'SEV-3': 240, 'SEV-4': 1440 };

    // Update target service health
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === preset.targetServiceId) {
          const isSev1 = preset.severity === 'SEV-1';
          return {
            ...s,
            status: isSev1 ? 'outage' : 'degraded',
            latencyMs: preset.type === 'latency' ? 1420 : s.latencyMs * 4,
            p99LatencyMs: preset.type === 'latency' ? 3200 : s.p99LatencyMs * 4,
            errorRate: preset.type === '5xx' ? 19.8 : preset.type === 'deadlock' ? 14.5 : 4.2,
            cpuUsage: preset.type === 'cpu' ? 96 : Math.min(95, s.cpuUsage + 35),
            memoryUsage: Math.min(94, s.memoryUsage + 25),
          };
        }
        return s;
      })
    );

    const targetSvc = servicesRef.current.find((s) => s.id === preset.targetServiceId);

    const newIncident: Incident = {
      id: newIncId,
      title: `${preset.name} on ${targetSvc?.name || preset.targetServiceId}`,
      description: preset.description,
      severity: preset.severity,
      status: 'investigating',
      serviceId: preset.targetServiceId,
      serviceName: targetSvc?.name || preset.targetServiceId,
      affectedServices: [preset.targetServiceId, 'api-gateway'],
      impactedUsers: Math.floor(800 + Math.random() * 4500),
      region: targetSvc?.region || 'us-east-1',
      assignee: INITIAL_ASSIGNEES[Math.floor(Math.random() * INITIAL_ASSIGNEES.length)],
      createdAt: nowIso,
      acknowledgedAt: null,
      identifiedAt: null,
      mitigatedAt: null,
      resolvedAt: null,
      slaMinutes: slaMap[preset.severity],
      timeline: [
        {
          id: 't-init',
          timestamp: nowIso,
          author: 'Chaos Engine / Watchdog',
          message: `ANOMALY INJECTED: ${preset.description} - Telemetry breach triggered.`,
          type: 'detection',
        },
      ],
      rootCauseCategory: preset.type === 'deadlock' ? 'db_deadlock' : preset.type === '5xx' ? 'third_party' : 'infrastructure_failure',
      rootCauseSummary: `Synthetically injected chaos pattern: ${preset.name}`,
      runbookUrl: `https://runbooks.internal/sre/${preset.targetServiceId}-triage`,
      tags: ['chaos-injected', preset.type, targetSvc?.tier || 'service'],
    };

    setIncidents((prev) => [newIncident, ...prev]);

    // Push critical alert to log feed
    const alertLog: LogEvent = {
      id: 'log-alert-' + Date.now(),
      timestamp: nowIso,
      serviceId: preset.targetServiceId,
      serviceName: targetSvc?.name || preset.targetServiceId,
      level: 'critical',
      message: `[SEV_ALERT] ${preset.name} - threshold violation on ${targetSvc?.name}`,
      statusCode: 500,
      latency: 2450,
      traceId: 'tr-chaos-' + Math.random().toString(36).substring(2, 6),
    };
    setLogEvents((prev) => [alertLog, ...prev]);
  }, []);

  const triggerRollback = useCallback((serviceId: string, version = 'vPreviousStable') => {
    soundFx.playAcknowledgeChime();
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            version: `${s.version}-rollback`,
            status: 'operational',
            latencyMs: Math.max(15, Math.round(s.latencyMs * 0.4)),
            p99LatencyMs: Math.max(35, Math.round(s.p99LatencyMs * 0.4)),
            errorRate: 0.01,
            cpuUsage: Math.max(30, Math.round(s.cpuUsage * 0.7)),
          };
        }
        return s;
      })
    );

    const nowIso = new Date().toISOString();
    const svc = servicesRef.current.find((s) => s.id === serviceId);

    const log: LogEvent = {
      id: 'log-rollback-' + Date.now(),
      timestamp: nowIso,
      serviceId,
      serviceName: svc?.name || serviceId,
      level: 'warn',
      message: `[DEPLOYMENT ROLLBACK] Service ${svc?.name} rolled back to ${version}. Traffic drained and healthy pods re-spawned.`,
      statusCode: 200,
      traceId: 'tr-rb-' + Math.random().toString(36).substring(2, 6),
    };
    setLogEvents((prev) => [log, ...prev]);
  }, []);

  const restartService = useCallback((serviceId: string) => {
    soundFx.playClick();
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            status: 'maintenance',
            cpuUsage: 15,
            memoryUsage: 20,
          };
        }
        return s;
      })
    );

    // After 2.5 seconds, bring back to operational
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === serviceId) {
            return {
              ...s,
              status: 'operational',
              latencyMs: 16,
              p99LatencyMs: 40,
              errorRate: 0.0,
              cpuUsage: 35,
              memoryUsage: 45,
            };
          }
          return s;
        })
      );
      soundFx.playResolvedChime();
    }, 2500);

    const svc = servicesRef.current.find((s) => s.id === serviceId);
    const log: LogEvent = {
      id: 'log-restart-' + Date.now(),
      timestamp: new Date().toISOString(),
      serviceId,
      serviceName: svc?.name || serviceId,
      level: 'info',
      message: `[POD RESTART] Rolling restart triggered for ${svc?.name}. Replicas: ${svc?.replicas || 4}`,
      statusCode: 200,
      traceId: 'tr-rst-' + Math.random().toString(36).substring(2, 6),
    };
    setLogEvents((prev) => [log, ...prev]);
  }, []);

  const healAllServices = useCallback(() => {
    soundFx.playResolvedChime();
    setServices(INITIAL_SERVICES);
    // Mark all active incidents as resolved
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.status !== 'resolved') {
          return {
            ...inc,
            status: 'resolved',
            resolvedAt: new Date().toISOString(),
            timeline: [
              ...inc.timeline,
              {
                id: 't-' + Date.now(),
                timestamp: new Date().toISOString(),
                author: 'SRE Command Healing Engine',
                message: 'All system metrics stabilized and services restored to full operational status.',
                type: 'resolution',
              },
            ],
          };
        }
        return inc;
      })
    );

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  }, []);

  const createIncident = useCallback((partial: Partial<Incident>): Incident => {
    soundFx.playCriticalAlert();
    const nowIso = new Date().toISOString();
    const newIncId = 'INC-' + Math.floor(1000 + Math.random() * 9000);
    const severity = partial.severity || 'SEV-2';
    const slaMap: Record<IncidentSeverity, number> = { 'SEV-1': 15, 'SEV-2': 60, 'SEV-3': 240, 'SEV-4': 1440 };

    const targetSvc = servicesRef.current.find((s) => s.id === partial.serviceId) || servicesRef.current[0];

    const newInc: Incident = {
      id: newIncId,
      title: partial.title || `Degradation in ${targetSvc.name}`,
      description: partial.description || 'Elevated latency and error rate detected in service mesh.',
      severity,
      status: 'investigating',
      serviceId: targetSvc.id,
      serviceName: targetSvc.name,
      affectedServices: [targetSvc.id, 'api-gateway'],
      impactedUsers: partial.impactedUsers || 1200,
      region: targetSvc.region,
      assignee: partial.assignee || INITIAL_ASSIGNEES[0],
      createdAt: nowIso,
      acknowledgedAt: null,
      identifiedAt: null,
      mitigatedAt: null,
      resolvedAt: null,
      slaMinutes: slaMap[severity],
      timeline: [
        {
          id: 't-init',
          timestamp: nowIso,
          author: 'Incident Command',
          message: `Incident declared as ${severity}. Response team assigned.`,
          type: 'detection',
        },
      ],
      rootCauseCategory: partial.rootCauseCategory || 'infrastructure_failure',
      rootCauseSummary: partial.rootCauseSummary || 'Under active investigation.',
      runbookUrl: `https://runbooks.internal/sre/${targetSvc.id}`,
      tags: partial.tags || [targetSvc.id, severity.toLowerCase()],
    };

    setIncidents((prev) => [newInc, ...prev]);
    return newInc;
  }, []);

  const savePostMortem = useCallback((pm: PostMortem) => {
    soundFx.playResolvedChime();
    setPostMortems((prev) => {
      const idx = prev.findIndex((p) => p.id === pm.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = pm;
        return next;
      }
      return [pm, ...prev];
    });
  }, []);

  return (
    <IncidentContext.Provider
      value={{
        services,
        incidents,
        logEvents,
        activeTab,
        setActiveTab,
        selectedIncident,
        setSelectedIncident,
        selectedService,
        setSelectedService,
        postMortems,
        activePostMortem,
        setActivePostMortem,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isStreamPaused,
        setIsStreamPaused,
        streamSpeed,
        setStreamSpeed,
        isMuted,
        toggleMute,
        acknowledgeIncident,
        changeSeverity,
        moveIncidentStatus,
        addTimelineEvent,
        triggerAnomaly,
        triggerRollback,
        restartService,
        healAllServices,
        createIncident,
        savePostMortem,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};
