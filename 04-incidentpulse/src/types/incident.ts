export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export type ServiceTier = 'edge' | 'api' | 'domain' | 'storage' | 'messaging';

export interface ServiceNode {
  id: string;
  name: string;
  tier: ServiceTier;
  status: ServiceStatus;
  latencyMs: number;
  p99LatencyMs: number;
  errorRate: number; // percentage e.g. 0.05 = 0.05%
  rps: number;
  cpuUsage: number; // 0-100%
  memoryUsage: number; // 0-100%
  dependencies: string[]; // target service IDs
  region: string;
  version: string;
  replicas: number;
  x: number;
  y: number;
  description: string;
}

export type IncidentSeverity = 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';

export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved';

export type TimelineEventType = 'detection' | 'investigation' | 'mitigation' | 'resolution' | 'communication' | 'system';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  type: TimelineEventType;
}

export type RootCauseCategory =
  | 'code_regression'
  | 'infrastructure_failure'
  | 'config_drift'
  | 'third_party'
  | 'traffic_spike'
  | 'db_deadlock'
  | 'human_error'
  | 'cache_invalidation';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
  initials: string;
}

export interface Incident {
  id: string; // e.g. "INC-8492"
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  serviceId: string;
  serviceName: string;
  affectedServices: string[];
  impactedUsers: number;
  region: string;
  assignee: Assignee;
  createdAt: string; // ISO string
  acknowledgedAt: string | null;
  identifiedAt: string | null;
  mitigatedAt: string | null;
  resolvedAt: string | null;
  slaMinutes: number; // 15 for SEV-1, 60 for SEV-2, 240 for SEV-3, 1440 for SEV-4
  timeline: TimelineEvent[];
  rootCauseCategory: RootCauseCategory;
  rootCauseSummary: string;
  runbookUrl?: string;
  tags: string[];
}

export interface LogEvent {
  id: string;
  timestamp: string;
  serviceId: string;
  serviceName: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  message: string;
  statusCode?: number;
  latency?: number;
  traceId?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'todo' | 'in_progress' | 'completed';
  dueDate: string;
}

export interface PostMortem {
  id: string;
  incidentId: string;
  title: string;
  summary: string;
  leadInvestigator: string;
  impactDurationMinutes: number;
  revenueImpactEstimate: string;
  userImpactSummary: string;
  detectionMechanism: string;
  rootCause5Whys: string[];
  timeline: TimelineEvent[];
  actionItems: ActionItem[];
  lessonsLearned: {
    wentWell: string[];
    wentPoorly: string[];
    whereWeGotLucky: string[];
  };
  publishedAt: string;
}

export type ViewTab = 'command-center' | 'kanban' | 'stream' | 'post-mortem' | 'topology';

export interface AnomalyPreset {
  id: string;
  name: string;
  description: string;
  targetServiceId: string;
  severity: IncidentSeverity;
  type: 'latency' | '5xx' | 'deadlock' | 'lag' | 'cpu';
}
