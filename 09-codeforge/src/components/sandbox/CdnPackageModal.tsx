import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { CDN_PACKAGES } from '../../data/sampleTemplates';
import { Check, Plus, Trash2 } from 'lucide-react';

interface CdnPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCdns: string[];
  onToggleCdn: (url: string) => void;
  onAddCustomCdn: (url: string) => void;
  onRemoveCdn: (url: string) => void;
}

export const CdnPackageModal: React.FC<CdnPackageModalProps> = ({
  isOpen,
  onClose,
  selectedCdns,
  onToggleCdn,
  onAddCustomCdn,
  onRemoveCdn
}) => {
  const [customUrl, setCustomUrl] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onAddCustomCdn(customUrl.trim());
    setCustomUrl('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="External Scripts & Stylesheets (CDNs)" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Popular CDN Packages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Popular Libraries &amp; Frameworks
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {CDN_PACKAGES.map((pkg) => {
              const isSelected = selectedCdns.includes(pkg.url);

              return (
                <div
                  key={pkg.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-input)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {pkg.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: pkg.category === 'css' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: pkg.category === 'css' ? '#f43f5e' : '#38bdf8'
                        }}
                      >
                        {pkg.category.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {pkg.description}
                    </div>
                  </div>

                  <button
                    className={isSelected ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '5px 10px', fontSize: '0.72rem', flexShrink: 0 }}
                    onClick={() => onToggleCdn(pkg.url)}
                  >
                    {isSelected ? (
                      <>
                        <Check size={12} /> Active
                      </>
                    ) : (
                      <>
                        <Plus size={12} /> Add
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom CDN Link Adder */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Add Custom CDN URL
          </h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="url"
              className="form-input"
              placeholder="https://cdn.jsdelivr.net/npm/package@version/dist/bundle.js"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </form>

        {/* Active Custom CDNs */}
        {selectedCdns.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
              Active Loaded CDNs ({selectedCdns.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedCdns.map((url) => (
                <div
                  key={url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>
                    {url}
                  </span>
                  <button
                    onClick={() => onRemoveCdn(url)}
                    style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
