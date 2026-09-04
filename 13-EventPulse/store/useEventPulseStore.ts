import { create } from 'zustand';
import {
  ConsumerWorker,
  DLQItem,
  EventPacket,
  EventType,
  Partition,
} from '../types/stream';
import {
  CompatibilityMode,
  SchemaDefinition,
  SchemaValidationResult,
} from '../types/schema';
import {
  BASELINE_SCHEMA_V1,
  SCHEMA_PRESET_COMPATIBLE,
  SCHEMA_PRESET_BREAKING_DELETION,
  SCHEMA_PRESET_TYPE_MUTATION,
  SCHEMA_PRESET_REQUIRED_NO_DEFAULT,
} from '../data/schemaPresets';
import { validateSchemaCompatibility } from '../utils/schemaValidator';

interface EventPulseState {
  packets: EventPacket[];
  partitions: Partition[];
  workers: ConsumerWorker[];
  dlq: DLQItem[];
  isDLQDrawerOpen: boolean;
  activeMobileTab: 'pipeline' | 'schema' | 'chaos';

  // Metrics
  throughputMsgSec: number;
  totalEventsProcessed: number;
  p99CommitLatencyMs: number;
  errorRatePct: number;

  // Chaos flags
  chaos: {
    consumerCrash: boolean;
    poisonPillActive: boolean;
    partitionLagActive: boolean;
  };

  // Schema state
  schemaV1: SchemaDefinition;
  schemaV2: SchemaDefinition;
  activePresetName: string;
  compatibilityMode: CompatibilityMode;
  validationResult: SchemaValidationResult;

  // Actions
  toggleConsumerCrash: () => void;
  injectPoisonPill: () => void;
  togglePartitionLag: () => void;
  reprocessDLQItem: (dlqId: string) => void;
  purgeDLQ: () => void;
  toggleDLQDrawer: (open?: boolean) => void;
  setActiveMobileTab: (tab: 'pipeline' | 'schema' | 'chaos') => void;
  setSchemaV2Preset: (presetName: string) => void;
  setCompatibilityMode: (mode: CompatibilityMode) => void;
  updateSchemaV2: (schema: SchemaDefinition) => void;
  tickSimulation: () => void;
}

const INITIAL_PARTITIONS: Partition[] = [
  {
    id: 0,
    name: 'partition-0',
    currentOffset: 1489210,
    lag: 14,
    assignedWorkerId: 'worker-alpha',
    throughputMsgSec: 480,
    isThrottled: false,
  },
  {
    id: 1,
    name: 'partition-1',
    currentOffset: 1489182,
    lag: 18,
    assignedWorkerId: 'worker-beta',
    throughputMsgSec: 495,
    isThrottled: false,
  },
  {
    id: 2,
    name: 'partition-2',
    currentOffset: 1489140,
    lag: 12,
    assignedWorkerId: 'worker-gamma',
    throughputMsgSec: 445,
    isThrottled: false,
  },
];

const INITIAL_WORKERS: ConsumerWorker[] = [
  {
    id: 'worker-alpha',
    name: 'Worker Alpha',
    status: 'healthy',
    assignedPartitions: [0],
    processedCount: 528900,
    p99LatencyMs: 2.1,
    lastHeartbeat: '12ms ago',
  },
  {
    id: 'worker-beta',
    name: 'Worker Beta',
    status: 'healthy',
    assignedPartitions: [1],
    processedCount: 512400,
    p99LatencyMs: 2.4,
    lastHeartbeat: '10ms ago',
  },
  {
    id: 'worker-gamma',
    name: 'Worker Gamma',
    status: 'healthy',
    assignedPartitions: [2],
    processedCount: 447800,
    p99LatencyMs: 2.2,
    lastHeartbeat: '8ms ago',
  },
];

const EVENT_TYPES: EventType[] = [
  'ORDER_CREATED',
  'PAYMENT_AUTHORIZED',
  'INVENTORY_RESERVED',
  'FRAUD_ALERT',
  'SHIPPING_DISPATCHED',
];

export const useEventPulseStore = create<EventPulseState>((set, get) => {
  const initialV1 = BASELINE_SCHEMA_V1;
  const initialV2 = SCHEMA_PRESET_COMPATIBLE;
  const initialValidation = validateSchemaCompatibility(
    initialV1,
    initialV2,
    'BACKWARD'
  );

  return {
    packets: [],
    partitions: INITIAL_PARTITIONS,
    workers: INITIAL_WORKERS,
    dlq: [],
    isDLQDrawerOpen: false,
    activeMobileTab: 'pipeline',

    throughputMsgSec: 1420,
    totalEventsProcessed: 1489140,
    p99CommitLatencyMs: 2.3,
    errorRatePct: 0.02,

    chaos: {
      consumerCrash: false,
      poisonPillActive: false,
      partitionLagActive: false,
    },

    schemaV1: initialV1,
    schemaV2: initialV2,
    activePresetName: 'compatible',
    compatibilityMode: 'BACKWARD',
    validationResult: initialValidation,

    toggleConsumerCrash: () => {
      const current = get().chaos.consumerCrash;
      const nextState = !current;

      set((state) => {
        let updatedWorkers = [...state.workers];
        let updatedPartitions = [...state.partitions];

        if (nextState) {
          // Crash Worker Beta: Trigger group rebalance!
          // Worker Alpha takes over Partition 1
          updatedWorkers = updatedWorkers.map((w) => {
            if (w.id === 'worker-beta') {
              return { ...w, status: 'crashed', assignedPartitions: [] };
            }
            if (w.id === 'worker-alpha') {
              return {
                ...w,
                status: 'rebalancing',
                assignedPartitions: [0, 1],
                p99LatencyMs: 8.4,
              };
            }
            return w;
          });

          updatedPartitions = updatedPartitions.map((p) => {
            if (p.id === 1) {
              return { ...p, assignedWorkerId: 'worker-alpha', lag: p.lag + 84 };
            }
            return p;
          });
        } else {
          // Restore Worker Beta
          updatedWorkers = INITIAL_WORKERS;
          updatedPartitions = INITIAL_PARTITIONS;
        }

        return {
          chaos: { ...state.chaos, consumerCrash: nextState },
          workers: updatedWorkers,
          partitions: updatedPartitions,
          throughputMsgSec: nextState ? 940 : 1420,
        };
      });
    },

    injectPoisonPill: () => {
      const poisonId = `poison-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const targetPartition = 1;

      const poisonPacket: EventPacket = {
        id: poisonId,
        type: 'POISON_PILL',
        partitionId: targetPartition,
        offset: get().partitions[targetPartition].currentOffset + 1,
        key: 'malformed_unparseable_json_0xDEAD',
        payload: {
          corruptedBytes: '0xFF_INVALID_UTF8_STACK_OVERFLOW',
          expectedSchema: 'com.eventpulse.orders.OrderCompletedEvent',
          rawBuffer: '<NULL_BYTE_EXPLOIT_PAYLOAD>',
        },
        timestamp: Date.now(),
        stage: 'ingestion',
        status: 'quarantined',
        laneProgress: 0.1,
        schemaVersion: 999,
        isPoisonPill: true,
      };

      const dlqEntry: DLQItem = {
        id: `dlq-${Date.now()}`,
        packet: poisonPacket,
        errorType: 'DESERIALIZATION_FAILURE',
        errorMessage: 'JSON Parse error: Unescaped null character at byte offset 0x004F2A. Schema registry mismatch.',
        timestamp: new Date().toLocaleTimeString(),
        reprocessedCount: 0,
        quarantineReason: 'Fatal consumer panic caught by circuit breaker. Diverted to DLQ.',
      };

      set((state) => ({
        packets: [poisonPacket, ...state.packets.slice(0, 18)],
        dlq: [dlqEntry, ...state.dlq],
        errorRatePct: Math.min(1.8, Number((state.errorRatePct + 0.15).toFixed(2))),
      }));
    },

    togglePartitionLag: () => {
      const current = get().chaos.partitionLagActive;
      const nextState = !current;

      set((state) => ({
        chaos: { ...state.chaos, partitionLagActive: nextState },
        partitions: state.partitions.map((p) => {
          if (p.id === 2) {
            return {
              ...p,
              isThrottled: nextState,
              lag: nextState ? 5480 : 12,
            };
          }
          return p;
        }),
        p99CommitLatencyMs: nextState ? 5012 : 2.3,
      }));
    },

    reprocessDLQItem: (dlqId: string) => {
      const item = get().dlq.find((d) => d.id === dlqId);
      if (!item) return;

      // Fix packet: remove poison pill status and re-route
      const sanitizedPacket: EventPacket = {
        ...item.packet,
        id: `reprocessed-${Date.now()}`,
        type: 'ORDER_CREATED',
        isPoisonPill: false,
        status: 'active',
        stage: 'ingestion',
        laneProgress: 0,
        payload: {
          orderId: 'fixed-order-repaired',
          customerId: 'cust-recovered-991',
          totalAmountCents: 4999,
          currency: 'USD',
          reprocessedAudit: true,
        },
      };

      set((state) => ({
        dlq: state.dlq.filter((d) => d.id !== dlqId),
        packets: [sanitizedPacket, ...state.packets],
        totalEventsProcessed: state.totalEventsProcessed + 1,
        errorRatePct: Math.max(0.01, Number((state.errorRatePct - 0.05).toFixed(2))),
      }));
    },

    purgeDLQ: () => {
      set({ dlq: [] });
    },

    toggleDLQDrawer: (open?: boolean) => {
      set((state) => ({
        isDLQDrawerOpen: open !== undefined ? open : !state.isDLQDrawerOpen,
      }));
    },

    setActiveMobileTab: (tab: 'pipeline' | 'schema' | 'chaos') => {
      set({ activeMobileTab: tab });
    },

    setSchemaV2Preset: (presetName: string) => {
      let preset = SCHEMA_PRESET_COMPATIBLE;
      if (presetName === 'breaking_deletion') {
        preset = SCHEMA_PRESET_BREAKING_DELETION;
      } else if (presetName === 'type_mutation') {
        preset = SCHEMA_PRESET_TYPE_MUTATION;
      } else if (presetName === 'required_no_default') {
        preset = SCHEMA_PRESET_REQUIRED_NO_DEFAULT;
      }

      const result = validateSchemaCompatibility(
        get().schemaV1,
        preset,
        get().compatibilityMode
      );

      set({
        schemaV2: preset,
        activePresetName: presetName,
        validationResult: result,
      });
    },

    setCompatibilityMode: (mode: CompatibilityMode) => {
      const result = validateSchemaCompatibility(
        get().schemaV1,
        get().schemaV2,
        mode
      );
      set({
        compatibilityMode: mode,
        validationResult: result,
      });
    },

    updateSchemaV2: (schema: SchemaDefinition) => {
      const result = validateSchemaCompatibility(
        get().schemaV1,
        schema,
        get().compatibilityMode
      );
      set({
        schemaV2: schema,
        validationResult: result,
      });
    },

    tickSimulation: () => {
      const { packets, partitions, chaos } = get();

      // Advance existing packets along pipeline
      const updatedPackets = packets
        .map((p) => {
          const nextProgress = p.laneProgress + 0.08;
          let nextStage = p.stage;
          if (nextProgress > 0.35 && p.stage === 'ingestion') {
            nextStage = 'partition';
          } else if (nextProgress > 0.7 && p.stage === 'partition') {
            nextStage = 'consumer';
          }

          return {
            ...p,
            laneProgress: nextProgress,
            stage: nextStage,
          };
        })
        .filter((p) => p.laneProgress < 1.05);

      // Spawn new packet every couple ticks
      if (Math.random() > 0.4) {
        const partitionId = Math.floor(Math.random() * 3);
        const eventType =
          EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

        const newPacket: EventPacket = {
          id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: eventType,
          partitionId,
          offset: partitions[partitionId].currentOffset + 1,
          key: `order-${Math.floor(Math.random() * 9000 + 1000)}`,
          payload: {
            amountCents: Math.floor(Math.random() * 25000 + 1000),
            currency: 'USD',
            status: 'VERIFIED',
          },
          timestamp: Date.now(),
          stage: 'ingestion',
          status: 'active',
          laneProgress: 0,
          schemaVersion: 1,
        };

        updatedPackets.unshift(newPacket);
      }

      // Update partition offsets and live metrics
      const updatedPartitions = partitions.map((p) => ({
        ...p,
        currentOffset: p.currentOffset + Math.floor(Math.random() * 3 + 1),
        lag: p.isThrottled
          ? p.lag + Math.floor(Math.random() * 12 + 5)
          : Math.max(4, p.lag + Math.floor(Math.random() * 3 - 1)),
      }));

      const jitterThroughput = chaos.consumerCrash
        ? 940 + Math.floor(Math.random() * 60 - 30)
        : 1420 + Math.floor(Math.random() * 80 - 40);

      set((state) => ({
        packets: updatedPackets.slice(0, 24),
        partitions: updatedPartitions,
        throughputMsgSec: jitterThroughput,
        totalEventsProcessed: state.totalEventsProcessed + 4,
      }));
    },
  };
});
