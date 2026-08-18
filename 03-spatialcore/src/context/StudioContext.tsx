import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { ProductConfig, ProductPartId, MaterialTierId } from '../types/product';
import type { CartItem, PromoCode } from '../types/cart';
import type { CameraPresetId, StudioLightingMode } from '../types/studio';
import { DESIGNER_PRESETS } from '../services/materialLibrary';
import { calculateConfigPrice, VALID_PROMO_CODES } from '../services/pricingEngine';
import { captureStudioSnapshot } from '../services/snapshotService';
import { StudioContext } from './StudioContextCore';

const DEFAULT_CONFIG: ProductConfig = {
  upper: { material: 'leather', color: '#0f172a' },
  sole: { material: 'carbon', color: '#1e293b' },
  cushion: { material: 'polycarbonate', color: '#00f0ff' },
  cage: { material: 'titanium', color: '#e2e8f0' },
  heel: { material: 'carbon', color: '#0f172a' },
  laces: { material: 'titanium', color: '#00f0ff' },
};

const STORAGE_KEY_CONFIG = 'spatialcore_active_config_v1';
const STORAGE_KEY_CART = 'spatialcore_cart_v1';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productConfig, setProductConfig] = useState<ProductConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }
    return DEFAULT_CONFIG;
  });

  const [activePartId, setActivePartId] = useState<ProductPartId>('upper');
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<StudioLightingMode>('studio');
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('iso');
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>('US 10.5');

  // Cart & E-Commerce state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [snapshotModalUrl, setSnapshotModalUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Save config & cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(productConfig));
    } catch {
      // Ignored
    }
  }, [productConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignored
    }
  }, [cart]);

  // Update part material
  const updatePartMaterial = useCallback((partId: ProductPartId, material: MaterialTierId) => {
    setProductConfig((prev) => ({
      ...prev,
      [partId]: { ...prev[partId], material },
    }));
  }, []);

  // Update part color
  const updatePartColor = useCallback((partId: ProductPartId, color: string) => {
    setProductConfig((prev) => ({
      ...prev,
      [partId]: { ...prev[partId], color },
    }));
  }, []);

  // Apply designer preset configuration
  const applyPresetDesign = useCallback(
    (presetId: string) => {
      const preset = DESIGNER_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setProductConfig(preset.config);
        showToast(`Loaded preset style: ${preset.name}`);
      }
    },
    [showToast]
  );

  // Toggle exploded view
  const toggleExploded = useCallback(() => {
    setIsExploded((prev) => {
      const next = !prev;
      showToast(next ? 'Exploded View Mode: Active' : 'Assembled View Mode: Active', 'info');
      return next;
    });
  }, [showToast]);

  // Active price breakdown
  const activePrice = useMemo(() => {
    return calculateConfigPrice(productConfig);
  }, [productConfig]);

  // Add to cart
  const addToCart = useCallback(
    (size: string = selectedShoeSize) => {
      const newItem: CartItem = {
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: 'SpatialPulse Apex-01 Custom',
        config: { ...productConfig },
        unitPrice: activePrice.unitPrice,
        quantity: 1,
        size,
        timestamp: Date.now(),
      };
      setCart((prev) => [newItem, ...prev]);
      setIsCartOpen(true);
      showToast('Custom build added to cart!', 'success');
    },
    [productConfig, activePrice.unitPrice, selectedShoeSize, showToast]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  // Update cart item quantity
  const updateCartQuantity = useCallback((itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  // Promo code logic
  const applyPromo = useCallback(
    (code: string): boolean => {
      const clean = code.trim().toUpperCase();
      const promo = VALID_PROMO_CODES[clean];
      if (promo) {
        setAppliedPromo(promo);
        showToast(`Promo code "${promo.code}" applied! (${promo.description})`, 'success');
        return true;
      }
      showToast('Invalid or expired promo code', 'warning');
      return false;
    },
    [showToast]
  );

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoInput('');
    showToast('Promo code removed', 'info');
  }, [showToast]);

  // Take Snapshot
  const takeSnapshot = useCallback(async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) {
      showToast('Unable to capture 3D canvas', 'warning');
      return;
    }

    try {
      const snapshotUrl = await captureStudioSnapshot(canvas, productConfig);
      setSnapshotModalUrl(snapshotUrl);
      showToast('4K Studio Snapshot captured!');
    } catch (e) {
      console.error('Snapshot capture error:', e);
      showToast('Failed to generate snapshot', 'warning');
    }
  }, [productConfig, showToast]);

  return (
    <StudioContext.Provider
      value={{
        productConfig,
        activePartId,
        setActivePartId,
        updatePartMaterial,
        updatePartColor,
        applyPresetDesign,
        isExploded,
        toggleExploded,
        autoRotate,
        setAutoRotate,
        wireframeMode,
        setWireframeMode,
        lightingMode,
        setLightingMode,
        cameraPreset,
        setCameraPreset,
        activePrice,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        promoInput,
        setPromoInput,
        appliedPromo,
        applyPromo,
        removePromo,
        snapshotModalUrl,
        setSnapshotModalUrl,
        takeSnapshot,
        selectedShoeSize,
        setSelectedShoeSize,
        toast,
        showToast,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};
