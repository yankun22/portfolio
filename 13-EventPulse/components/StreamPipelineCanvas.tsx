'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import { EventPacket } from '../types/stream';
import {
  Layers,
  ArrowRight,
  Radio,
  Server,
  Cpu,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Skull,
  Zap,
  Gauge,
  ShieldAlert,
} from 'lucide-react';

export default function StreamPipelineCanvas() {
  const packets = useEventPulseStore((state) => state.packets);
  const partitions = useEventPulseStore((state) => state.partitions);
  const workers = useEventPulseStore((state) => state.workers);
  const chaos = useEventPulseStore((state) => state.chaos);
  const tickSimulation = useEventPulseStore((state) => state.tickSimulation);

  const [hoveredPacket, setHoveredPacket] = useState<EventPacket | null>(null);

  // Run continuous stream tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation();
    }, 120);

    return () => clearInterval(interval);
  }, [tickSimulation]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ORDER_CREATED':
        return '#06B6D4'; // Cyan
      case 'PAYMENT_AUTHORIZED':
        return '#10B981'; // Emerald
      case 'INVENTORY_RESERVED':
        return '#8B5CF6'; // Ultraviolet
      case 'FRAUD_ALERT':
        return '#F59E0B'; // Amber
      case 'SHIPPING_DISPATCHED':
        return '#3B82F6'; // Blue
      case 'POISON_PILL':
        return '#F43F5E'; // Crimson
      default:
        return '#A1A1AA';
    }
  };

  return (
    <div className="w-full rounded-2xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 shadow-cockpit-card p-4 sm:p-6 select-none space-y-6">
      {/* Title & Stream Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-ultra" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              3-Stage Real-Time Event Pipeline
            </h2>
            <p className="text-xs text-zinc-400">
              Ingress Gateway → Partitioned Topic (order-events) → Consumer Group (order-processors)
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Streaming Live</span>
          </span>
          {chaos.consumerCrash && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-bounce">
              <Skull className="w-3.5 h-3.5" />
              <span>Group Rebalance</span>
            </span>
          )}
          {chaos.partitionLagActive && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Lag Warning (P2)</span>
            </span>
          )}
        </div>
      </div>

      {/* 3 Pipeline Stages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative">
        {/* STAGE 1: INGESTION GATEWAY (Columns 1-3) */}
        <div className="lg:col-span-3 rounded-xl bg-canvas-deep/80 border border-white/10 p-4 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2 border-b border-white/5 pb-2">
              <span className="text-ultra-light font-bold flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-ultra" />
                Stage 1: Ingestion Gate
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                Port 9092
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Ingests raw HTTP/gRPC streams, evaluates rate limits, verifies CRC32 checksums, and hashes keys via Murmur2.
            </p>

            <div className="space-y-2 text-xs font-mono bg-black/40 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between">
                <span className="text-zinc-500">Rate Limiter:</span>
                <span className="text-emerald-400">PASSED (10k/s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Hash Router:</span>
                <span className="text-white">Murmur2 (Key)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Wire Protocol:</span>
                <span className="text-ultra-light">Schema Registry v1</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Payload CRC:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% VALID
            </span>
          </div>
        </div>

        {/* STAGE 2: PARTITIONED TOPIC (Columns 4-8) */}
        <div className="lg:col-span-5 rounded-xl bg-canvas-deep/80 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
            <span className="text-sky-300 font-bold flex items-center gap-1.5">
              <Server className="w-4 h-4 text-sky-400" />
              Stage 2: Topic (order-events)
            </span>
            <span className="text-[10px] text-zinc-400">
              3 Active Partitions
            </span>
          </div>

          {/* 3 Partition Cards */}
          <div className="space-y-2.5">
            {partitions.map((partition) => {
              const isThrottled = partition.isThrottled;
              return (
                <div
                  key={partition.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isThrottled
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-glow-amber'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="font-bold text-white">
                        {partition.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-zinc-400">
                        Offset: <strong className="text-white">{partition.currentOffset.toLocaleString()}</strong>
                      </span>
                      <span
                        className={`font-semibold ${
                          partition.lag > 1000
                            ? 'text-rose-400 animate-pulse'
                            : partition.lag > 50
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        Lag: {partition.lag.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Partition Visual Pipe with In-Flight Packets */}
                  <div className="relative w-full h-8 rounded bg-black/60 border border-white/10 overflow-hidden flex items-center px-2">
                    {/* Background Conveyor Grid Lines */}
                    <div className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:24px_100%]" />

                    {/* Flowing Packets matching this partition */}
                    {packets
                      .filter((p) => p.partitionId === partition.id)
                      .map((packet) => {
                        const packetColor = getEventTypeColor(packet.type);
                        const isPoison = packet.isPoisonPill;

                        return (
                          <div
                            key={packet.id}
                            onMouseEnter={() => setHoveredPacket(packet)}
                            onMouseLeave={() => setHoveredPacket(null)}
                            className="absolute -translate-y-1/2 top-1/2 transition-all duration-100 cursor-pointer"
                            style={{
                              left: `${Math.min(92, Math.max(4, packet.laneProgress * 100))}%`,
                            }}
                          >
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold text-black border shadow-md ${
                                isPoison ? 'animate-ping' : ''
                              }`}
                              style={{
                                backgroundColor: packetColor,
                                borderColor: '#FFFFFF',
                                boxShadow: `0 0 10px ${packetColor}`,
                              }}
                            >
                              {isPoison ? (
                                <Skull className="w-3.5 h-3.5 text-white" />
                              ) : (
                                packet.type.slice(0, 1)
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Partition Footer */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2">
                    <span>
                      Throughput: <strong className="text-zinc-300">{partition.throughputMsgSec} msg/s</strong>
                    </span>
                    <span>
                      Assigned: <strong className="text-ultra-light">{partition.assignedWorkerId}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE 3: CONSUMER GROUP WORKERS (Columns 9-12) */}
        <div className="lg:col-span-4 rounded-xl bg-canvas-deep/80 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
            <span className="text-emerald-300 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Stage 3: Consumer Group
            </span>
            <span className="text-[10px] text-zinc-400">
              order-processors
            </span>
          </div>

          <div className="space-y-2.5">
            {workers.map((worker) => {
              const isCrashed = worker.status === 'crashed';
              const isRebalancing = worker.status === 'rebalancing';

              return (
                <div
                  key={worker.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCrashed
                      ? 'bg-rose-500/15 border-rose-500/40'
                      : isRebalancing
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCrashed
                            ? 'bg-rose-500'
                            : isRebalancing
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span className="font-bold text-white">{worker.name}</span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        isCrashed
                          ? 'bg-rose-500/30 text-rose-300'
                          : isRebalancing
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {worker.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-black/40 p-2 rounded border border-white/5">
                    <div>
                      <span className="text-zinc-500 block">Partitions</span>
                      <span className="text-white font-semibold">
                        {worker.assignedPartitions.length > 0
                          ? `[${worker.assignedPartitions.join(', ')}]`
                          : 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Processed</span>
                      <span className="text-emerald-400 font-semibold">
                        {worker.processedCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">p99 Latency</span>
                      <span className="text-sky-300 font-semibold">
                        {worker.p99LatencyMs}ms
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hovered Packet Micro-Inspector HUD */}
      {hoveredPacket && (
        <div className="p-3 rounded-xl bg-canvas-deep border border-ultra/40 shadow-glow-ultra text-xs font-mono space-y-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="text-white font-bold flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getEventTypeColor(hoveredPacket.type) }}
              />
              Packet ID: {hoveredPacket.id}
            </span>
            <span className="text-ultra-light">Key: {hoveredPacket.key}</span>
          </div>
          <div className="text-zinc-300">
            Partition: {hoveredPacket.partitionId} | Offset: {hoveredPacket.offset} | Stage: {hoveredPacket.stage}
          </div>
          <pre className="text-[11px] text-zinc-400 overflow-x-auto bg-black/50 p-2 rounded">
            {JSON.stringify(hoveredPacket.payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
