import { createContext } from 'react';
import type { ProductConfig, ProductPartId, MaterialTierId } from '../types/product';
import type { CartItem, PromoCode } from '../types/cart';
import type { CameraPresetId, StudioLightingMode } from '../types/studio';
import type { PriceBreakdown } from '../services/pricingEngine';

export interface StudioContextType {
  productConfig: ProductConfig;
  activePartId: ProductPartId;
  setActivePartId: (id: ProductPartId) => void;
  updatePartMaterial: (partId: ProductPartId, material: MaterialTierId) => void;
  updatePartColor: (partId: ProductPartId, color: string) => void;
  applyPresetDesign: (presetId: string) => void;
  isExploded: boolean;
  toggleExploded: () => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  wireframeMode: boolean;
  setWireframeMode: (v: boolean) => void;
  lightingMode: StudioLightingMode;
  setLightingMode: (mode: StudioLightingMode) => void;
  cameraPreset: CameraPresetId;
  setCameraPreset: (preset: CameraPresetId) => void;
  activePrice: PriceBreakdown;
  cart: CartItem[];
  addToCart: (size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  promoInput: string;
  setPromoInput: (p: string) => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  snapshotModalUrl: string | null;
  setSnapshotModalUrl: (url: string | null) => void;
  takeSnapshot: () => Promise<void>;
  selectedShoeSize: string;
  setSelectedShoeSize: (size: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const StudioContext = createContext<StudioContextType | undefined>(undefined);
