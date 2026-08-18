import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { useStudio } from '../../context/useStudio';
import { downloadSnapshotImage } from '../../services/snapshotService';

export const SnapshotModal: React.FC = () => {
  const { snapshotModalUrl, setSnapshotModalUrl, showToast } = useStudio();

  if (!snapshotModalUrl) return null;

  const handleDownload = () => {
    downloadSnapshotImage(snapshotModalUrl, `spatialpulse_apex01_${Date.now()}.png`);
    showToast('High-Resolution PNG downloaded!');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Build URL copied to clipboard!', 'info');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSnapshotModalUrl(null)}>
      <div className="modal-content-card" style={{ maxWidth: '880px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              4K Studio Render & Specification Card
            </h2>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Composited 1920x1080 high-fidelity product render with material manifest
            </p>
          </div>
          <button
            type="button"
            className="btn-pill"
            style={{ padding: '6px' }}
            onClick={() => setSnapshotModalUrl(null)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Render Preview Image */}
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8)',
            marginBottom: '20px',
            background: '#040609',
          }}
        >
          <img
            src={snapshotModalUrl}
            alt="SpatialPulse Studio Render"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" className="btn-spatial btn-pill" onClick={handleShare}>
            <Share2 size={16} />
            <span>Copy Link</span>
          </button>

          <button type="button" className="btn-spatial btn-primary-glow" onClick={handleDownload}>
            <Download size={16} />
            <span>Download PNG (4K)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
