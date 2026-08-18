import React from 'react';
import { X, Trash2, Plus, Minus, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStudio } from '../../context/useStudio';
import { calculateOrderTotals } from '../../services/pricingEngine';
import { MATERIAL_TIERS } from '../../services/materialLibrary';
import type { ProductPartId } from '../../types/product';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    setIsCheckoutOpen,
    promoInput,
    setPromoInput,
    appliedPromo,
    applyPromo,
    removePromo,
  } = useStudio();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const totals = calculateOrderTotals(subtotal, appliedPromo?.code);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
    }
  };

  const handleProceedCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#00f0ff" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
              Custom Studio Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button type="button" className="btn-pill" style={{ padding: '6px' }} onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cart.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} strokeWidth={1} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Your custom bag is currently empty</p>
              <button type="button" className="btn-spatial btn-pill" onClick={() => setIsCartOpen(false)}>
                Back to 3D Customizer
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#00f0ff', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      Size: {item.size}
                    </div>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Material Breakdown Micro Swatches */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(Object.keys(item.config) as ProductPartId[]).map((partId) => {
                    const part = item.config[partId];
                    const tier = MATERIAL_TIERS[part.material];
                    return (
                      <div
                        key={partId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: part.color,
                          }}
                        />
                        <span>{partId.toUpperCase()}: {tier.name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Quantity Controls & Remove */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#090d15', borderRadius: 'var(--radius-sm)', padding: '2px 6px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                      onClick={() => updateCartQuantity(item.id, -1)}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                      onClick={() => updateCartQuantity(item.id, 1)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.725rem' }}
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={14} color="#ef4444" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code Box */}
        {cart.length > 0 && (
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            {appliedPromo ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} color="#10b981" />
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    {appliedPromo.code} APPLIED
                  </span>
                </div>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer' }}
                  onClick={removePromo}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handlePromoSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Promo Code (SPATIAL20, CYBER10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  style={{
                    flex: 1,
                    background: '#090d15',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.775rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
                <button type="submit" className="btn-spatial btn-pill">
                  Apply
                </button>
              </form>
            )}

            {/* Price Summary Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>${totals.subtotal.toFixed(2)}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount ({appliedPromo?.code}):</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>-${totals.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Courier Shipping:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: totals.shipping === 0 ? '#10b981' : '#fff' }}>
                  {totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Sales Tax (8.25%):</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>${totals.tax.toFixed(2)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#fff',
                  paddingTop: '8px',
                  marginTop: '4px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span>Total Due:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#00f0ff' }}>
                  ${totals.grandTotal.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              className="btn-spatial btn-primary-glow"
              style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '0.9rem' }}
              onClick={handleProceedCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
