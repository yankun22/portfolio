import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useWealth } from '../../context/useWealth';
import { Card } from '../common/Card';

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 10px ${fill}99)` }}
      />
    </g>
  );
};

const CustomDonutTooltip: React.FC<{ active?: boolean; payload?: any[]; currencySymbol?: string }> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: data.color }} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{data.name}</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: data.color }}>
          {data.formattedValue}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Share: {data.percent.toFixed(1)}% (Target: {data.targetPercent.toFixed(1)}%)
        </div>
      </div>
    );
  }
  return null;
};

export const AllocationDonut: React.FC = () => {
  const { summary, formatCurrency } = useWealth();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const categories = Object.values(summary.categoryBreakdown).filter((c) => c.value > 0);

  const chartData = categories.map((c) => ({
    name: c.category,
    value: c.value,
    formattedValue: formatCurrency(c.value),
    percent: c.percent,
    targetPercent: c.targetPercent,
    color: c.color,
  }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">Asset Allocation</h2>
          <p className="card-subtitle">Live capital distribution by asset class</p>
        </div>
      </div>

      {summary.totalValue === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          No assets recorded yet. Add assets to see allocation.
        </div>
      ) : (
        <>
          <div style={{ width: '100%', height: 230, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomDonutTooltip />} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                  // @ts-expect-error recharts activeShape prop
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="transparent"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Net Worth
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(summary.totalValue)}
              </div>
            </div>
          </div>

          {/* Allocation Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {Object.values(summary.categoryBreakdown).map((c) => (
              <div
                key={c.category}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  fontSize: '0.825rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: c.color }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(c.value)}</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: c.percent > 0 ? c.color : 'var(--text-muted)',
                      minWidth: '42px',
                      textAlign: 'right',
                    }}
                  >
                    {c.percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};
