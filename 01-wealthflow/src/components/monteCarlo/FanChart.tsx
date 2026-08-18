import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

const CustomFanChartTooltip = ({ active, payload, isInflationAdjusted, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const sym = currencySymbol || '$';
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-medium)',
          borderRadius: '10px',
          padding: '14px 18px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
          minWidth: '240px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
            Year {data.year} ({data.calendarYear})
          </span>
          <span className="badge badge-emerald">
            {isInflationAdjusted ? 'Real $' : 'Nominal $'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.825rem' }}>
          {/* 90th percentile */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              90th %ile (Bull):
            </span>
            <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {sym}{Math.round(data.p90).toLocaleString()}
            </strong>
          </div>

          {/* 50th percentile (Median) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              50th %ile (Median):
            </span>
            <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
              {sym}{Math.round(data.p50).toLocaleString()}
            </strong>
          </div>

          {/* 10th percentile */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
              10th %ile (Bear):
            </span>
            <strong style={{ color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>
              {sym}{Math.round(data.p10).toLocaleString()}
            </strong>
          </div>

          {/* Principal Contributed */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '6px',
              marginTop: '4px',
            }}
          >
            <span style={{ color: 'var(--text-muted)' }}>Total Principal:</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {sym}{Math.round(data.contributionsOnly).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const FanChart: React.FC = () => {
  const { mcResults, mcParams, formatCurrency, currency } = useWealth();

  const formatYAxis = (tick: number) => {
    if (tick >= 1000000) return `${currency.symbol}${(tick / 1000000).toFixed(1)}M`;
    if (tick >= 1000) return `${currency.symbol}${(tick / 1000).toFixed(0)}k`;
    return `${currency.symbol}${tick}`;
  };

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">Monte Carlo Stochastic Fan Chart</h2>
          <p className="card-subtitle">
            500 Simulated Paths • 10th, 50th (Median), and 90th Percentile Confidence Bands
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#38bdf8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(56, 189, 248, 0.4)' }} />
            90th %ile (Bull)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#10b981' }}>
            <span style={{ width: '10px', height: '3px', background: '#10b981' }} />
            50th %ile (Median Base)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#f43f5e' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(244, 63, 94, 0.3)' }} />
            10th %ile (Bear)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ width: '10px', height: '2px', background: 'var(--text-muted)', borderStyle: 'dashed' }} />
            Principal Saved
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mcResults.yearlyData}
            margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="p90Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
              </linearGradient>

              <linearGradient id="p50Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>

              <linearGradient id="p10Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis
              dataKey="year"
              stroke="var(--text-dim)"
              fontSize={11}
              tickLine={false}
              tickFormatter={(y) => `Yr ${y}`}
            />

            <YAxis
              stroke="var(--text-dim)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />

            <Tooltip
              content={
                <CustomFanChartTooltip
                  isInflationAdjusted={mcParams.isInflationAdjusted}
                  currencySymbol={currency.symbol}
                />
              }
            />

            {mcParams.targetGoalAmount > 0 && (
              <ReferenceLine
                y={mcParams.targetGoalAmount}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: `Goal: ${formatCurrency(mcParams.targetGoalAmount)}`,
                  fill: '#fbbf24',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="p90"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#p90Gradient)"
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="p50"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#p50Gradient)"
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey="p10"
              stroke="#f43f5e"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#p10Gradient)"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="contributionsOnly"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
