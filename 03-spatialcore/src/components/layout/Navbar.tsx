import React from 'react';
import {
  Box,
  ShoppingBag,
  Camera,
  Layers,
} from 'lucide-react';
import { useStudio } from '../../context/useStudio';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    isExploded,
    toggleExploded,
    takeSnapshot,
  } = useStudio();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="spatial-nav">
      {/* Brand & Studio Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#040812',
            boxShadow: '0 0 18px rgba(0, 240, 255, 0.45)',
          }}
        >
          <Box size={22} strokeWidth={2.2} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
            SpatialCore
          </h1>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            3D PRODUCT STUDIO & CUSTOMIZER
          </p>
        </div>
      </div>

      {/* Right Controls & Cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Exploded View Pill */}
        <button
          type="button"
          className={`btn-spatial btn-pill ${isExploded ? 'active' : ''}`}
          onClick={toggleExploded}
          title="Toggle Exploded View"
        >
          <Layers size={15} color={isExploded ? '#00f0ff' : 'var(--text-muted)'} />
          <span className="hide-mobile">{isExploded ? 'Assembled' : 'Explode'}</span>
        </button>

        {/* Snapshot Button */}
        <button
          type="button"
          className="btn-spatial btn-pill"
          onClick={takeSnapshot}
          title="Take 4K Snapshot"
        >
          <Camera size={15} color="#00f0ff" />
          <span className="hide-mobile">Snapshot</span>
        </button>

        {/* Cart Trigger */}
        <button
          type="button"
          className="btn-spatial btn-primary-glow"
          style={{ position: 'relative', padding: '8px 18px', borderRadius: '20px' }}
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag size={16} />
          <span>Bag</span>
          {totalItems > 0 && (
            <span
              style={{
                background: '#ffffff',
                color: '#040812',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.675rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                marginLeft: '4px',
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};
