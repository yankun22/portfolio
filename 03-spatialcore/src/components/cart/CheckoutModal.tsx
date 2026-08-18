import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useStudio } from '../../context/useStudio';
import { calculateOrderTotals } from '../../services/pricingEngine';
import type { CheckoutFormState } from '../../types/cart';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, appliedPromo, showToast } = useStudio();

  const [form, setForm] = useState<CheckoutFormState>({
    fullName: 'Alex Vance',
    email: 'alex.vance@spatialcore.design',
    address: '404 Cyberpunk Blvd, Suite 800',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States',
    paymentMethod: 'card',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totals = calculateOrderTotals(subtotal, appliedPromo?.code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setConfirmedOrderId(generatedId);
      setIsProcessing(false);
      setOrderComplete(true);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6'],
      });

      showToast('Order confirmed! Precision manufacturing started.', 'success');
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderComplete(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
        {orderComplete ? (
          <div style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
              Custom Build Order Confirmed!
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Order ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>#SPC-{confirmedOrderId}</span>
            </p>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0 auto' }}>
              Your custom shoes will be 3D printed and hand-assembled with precision laser inspection.
            </p>

            <button
              type="button"
              className="btn-spatial btn-primary-glow"
              style={{ marginTop: '24px', padding: '12px 28px' }}
              onClick={handleClose}
            >
              Return to 3D Studio
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#00f0ff" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  Secure Studio Checkout
                </h2>
              </div>
              <button type="button" className="btn-pill" style={{ padding: '6px' }} onClick={handleClose}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Full Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Zip / Postal
                    </label>
                    <input
                      type="text"
                      required
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      style={{ width: '100%', background: '#090d15', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', color: '#fff', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* Total Summary */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Grand Total ({cart.reduce((a, b) => a + b.quantity, 0)} items):
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
                    ${totals.grandTotal.toFixed(2)} USD
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-spatial btn-primary-glow"
                  style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '0.9rem' }}
                >
                  <ShieldCheck size={18} />
                  <span>{isProcessing ? 'Authorizing Payment...' : `Authorize Payment ($${totals.grandTotal.toFixed(2)})`}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
