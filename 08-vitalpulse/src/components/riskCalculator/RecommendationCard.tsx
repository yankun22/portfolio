import React from 'react';
import type { ClinicalRecommendation } from '../../types/clinicalRisk';
import { HeartPulse, Utensils, Activity, Stethoscope } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: ClinicalRecommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getIcon = () => {
    switch (recommendation.category) {
      case 'medication_review':
        return <Stethoscope size={18} color="#8b5cf6" />;
      case 'nutrition':
        return <Utensils size={18} color="#10b981" />;
      case 'lifestyle':
        return <Activity size={18} color="#06b6d4" />;
      case 'monitoring':
      default:
        return <HeartPulse size={18} color="#f43f5e" />;
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        transition: 'var(--transition-fast)'
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {getIcon()}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {recommendation.title}
          </h4>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.12)',
              color: '#06b6d4'
            }}
          >
            {recommendation.evidenceGrade}
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.45 }}>
          {recommendation.action}
        </p>
      </div>
    </div>
  );
};
