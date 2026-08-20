import React, { useState } from 'react';
import {
  X,
  Heart,
  Trash2,
  Columns,
  Eye,
  Calendar,
  Sparkles,
  Layers,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { CurrencyCode, Property, UnitSystem } from '../types/property';
import { formatArea, formatCurrency } from '../utils/formatters';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onSelectProperty: (p: Property) => void;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectProperty,
  currency,
  unitSystem,
}) => {
  const [showComparison, setShowComparison] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Slide-out Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '480px',
          background: '#0c0f15',
          borderLeft: '1px solid rgba(197, 160, 89, 0.4)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.8)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#12161f',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#f43f5e" fill="#f43f5e" />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', fontWeight: 600 }}>
              Saved Residences ({favorites.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: '#8e97a6', padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action strip if favorites exist */}
        {favorites.length > 0 && (
          <div
            style={{
              padding: '12px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {favorites.length >= 2 ? (
              <button
                onClick={() => setShowComparison(true)}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Columns size={14} /> Compare {favorites.length} Residences Side-by-Side
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#8e97a6' }}>
                Save at least 2 properties to compare
              </span>
            )}

            <button
              onClick={onClearFavorites}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', color: '#f43f5e' }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Favorites List */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8e97a6' }}>
              <Heart size={36} color="#475569" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ color: '#f8fafc', fontSize: '1.1rem' }}>No Saved Masterpieces Yet</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
                Click the heart icon on any architectural card to save and compare residences.
              </p>
            </div>
          ) : (
            favorites.map((prop) => (
              <div
                key={prop.id}
                className="glass-card"
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '12px',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <img
                  src={prop.heroImage}
                  alt={prop.title}
                  style={{ width: '90px', height: '70px', borderRadius: '8px', objectFit: 'cover' }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="gold-badge" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                      {prop.style}
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(prop.id)}
                      style={{ color: '#8e97a6', padding: '2px' }}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 600, marginTop: '4px' }}>
                    {prop.title}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.88rem', color: '#dfba73', fontWeight: 700 }} className="font-mono">
                      {formatCurrency(prop.purchasePrice, currency, true)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      style={{ fontSize: '0.75rem', color: '#c5a059', textDecoration: 'underline' }}
                    >
                      View Specs & Floor Plan
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Modal */}
      {showComparison && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 1200 }}
          onClick={() => setShowComparison(false)}
        >
          <div
            className="modal-content"
            style={{ maxWidth: '1100px', background: '#0e1219', border: '1px solid #c5a059' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Columns size={18} color="#c5a059" />
                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 600 }}>
                  Architectural Residence Comparison
                </h3>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                style={{ color: '#8e97a6', padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#8e97a6', width: '200px' }}>Attribute</th>
                    {favorites.map((p) => (
                      <th key={p.id} style={{ padding: '12px', textAlign: 'left', color: '#f8fafc' }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#dfba73' }}>{p.architect} ({p.yearBuilt})</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Architectural Style</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#f8fafc', fontWeight: 600 }}>
                        <span className="gold-badge" style={{ fontSize: '0.7rem' }}>{p.style}</span>
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Purchase Valuation</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#dfba73', fontWeight: 700 }} className="font-mono">
                        {formatCurrency(p.purchasePrice, currency)}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Nightly Stay Rate</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#f8fafc' }} className="font-mono">
                        {formatCurrency(p.nightlyRate, currency)} / nt
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Gross Rental Yield</td>
                    {favorites.map((p) => {
                      const y = ((p.projectedMonthlyRent * 12) / p.purchasePrice) * 100;
                      return (
                        <td key={p.id} style={{ padding: '12px', color: '#10b981', fontWeight: 700 }} className="font-mono">
                          {y.toFixed(2)}% ROI
                        </td>
                      );
                    })}
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Total Living Area</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#f8fafc' }} className="font-mono">
                        {formatArea(p.totalSqFt, unitSystem)}
                      </td>
                    ))}
                  </tr>

                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Bedrooms / Baths</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#f8fafc' }}>
                        {p.bedrooms} Beds • {p.bathrooms} Baths
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td style={{ padding: '12px', color: '#8e97a6' }}>Signature Materials</td>
                    {favorites.map((p) => (
                      <td key={p.id} style={{ padding: '12px', color: '#c7cbd3', fontSize: '0.8rem' }}>
                        {p.materialityStory.substring(0, 80)}...
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
