export type EventType =
  | 'ORDER_CREATED'
  | 'PAYMENT_AUTHORIZED'
  | 'INVENTORY_RESERVED'
  | 'FRAUD_ALERT'
  | 'SHIPPING_DISPATCHED'
  | 'POISON_PILL';

export interface EventPacket {
  id: string;
  type: EventType;
  partitionId: number;
  offset: number;
  key: string;
  payload: Record<string, unknown>;
  timestamp: number;
  stage: 'ingestion' | 'partition' | 'consumer';
  status: 'active' | 'consumed' | 'quarantined' | 'dlq';
  laneProgress: number; // 0.0 -> 1.0 along the pipeline stage
  workerId?: string;
  schemaVersion: number;
  isPoisonPill?: boolean;
}

export interface Partition {
  id: number;
  name: string;
  currentOffset: number;
  lag: number;
  assignedWorkerId: string;
  throughputMsgSec: number;
  isThrottled: boolean;
}

export interface ConsumerWorker {
  id: string;
  name: string;
  status: 'healthy' | 'rebalancing' | 'crashed' | 'lagging';
  assignedPartitions: number[];
  processedCount: number;
  p99LatencyMs: number;
  lastHeartbeat: string;
}

export interface DLQItem {
  id: string;
  packet: EventPacket;
  errorType:
    | 'DESERIALIZATION_FAILURE'
    | 'SCHEMA_REGISTRY_COMPATIBILITY_REJECTED'
    | 'CONSUMER_PANIC'
    | '5000MS_TIMEOUT_EXCEEDED';
  errorMessage: string;
  timestamp: string;
  reprocessedCount: number;
  quarantineReason: string;
}

export interface ChaosState {
  consumerCrash: boolean; // Worker Beta crashed
  poisonPillActive: boolean; // Malformed payload
  partitionLagActive: boolean; // Partition 2 throttled
}
