import type { ProductConfig } from '../types/product';
import type { PromoCode } from '../types/cart';
import { MATERIAL_TIERS } from './materialLibrary';

export const BASE_PRODUCT_PRICE = 180;
export const STANDARD_SHIPPING_PRICE = 15;
export const TAX_RATE = 0.0825; // 8.25%

export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  SPATIAL20: {
    code: 'SPATIAL20',
    discountType: 'percentage',
    value: 20,
    minSpend: 150,
    description: '20% off your entire custom order',
  },
  CYBER10: {
    code: 'CYBER10',
    discountType: 'fixed',
    value: 10,
    minSpend: 100,
    description: '$10 instant launch discount',
  },
  FREESHIP: {
    code: 'FREESHIP',
    discountType: 'fixed',
    value: 15,
    minSpend: 0,
    description: 'Free Express Courier Shipping',
  },
};

export interface PriceBreakdown {
  basePrice: number;
  upgradesTotal: number;
  unitPrice: number;
  itemizedUpgrades: { partName: string; materialName: string; price: number }[];
}

export function calculateConfigPrice(config: ProductConfig): PriceBreakdown {
  let upgradesTotal = 0;
  const itemizedUpgrades: { partName: string; materialName: string; price: number }[] = [];

  (Object.keys(config) as (keyof ProductConfig)[]).forEach((partId) => {
    const partConf = config[partId];
    const tier = MATERIAL_TIERS[partConf.material];
    if (tier && tier.priceAddon > 0) {
      upgradesTotal += tier.priceAddon;
      itemizedUpgrades.push({
        partName: partId.toUpperCase(),
        materialName: tier.name,
        price: tier.priceAddon,
      });
    }
  });

  const unitPrice = BASE_PRODUCT_PRICE + upgradesTotal;

  return {
    basePrice: BASE_PRODUCT_PRICE,
    upgradesTotal,
    unitPrice,
    itemizedUpgrades,
  };
}

export interface OrderTotalCalculation {
  subtotal: number;
  discountAmount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  appliedPromo: PromoCode | null;
}

export function calculateOrderTotals(
  subtotal: number,
  promoCodeInput?: string
): OrderTotalCalculation {
  let appliedPromo: PromoCode | null = null;
  let discountAmount = 0;
  let shipping = subtotal >= 250 ? 0 : STANDARD_SHIPPING_PRICE;

  if (promoCodeInput) {
    const normalized = promoCodeInput.trim().toUpperCase();
    const promo = VALID_PROMO_CODES[normalized];
    if (promo && subtotal >= promo.minSpend) {
      appliedPromo = promo;
      if (promo.code === 'FREESHIP') {
        shipping = 0;
        discountAmount = 0;
      } else if (promo.discountType === 'percentage') {
        discountAmount = (subtotal * promo.value) / 100;
      } else {
        discountAmount = promo.value;
      }
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * TAX_RATE;
  const grandTotal = taxableAmount + shipping + tax;

  return {
    subtotal,
    discountAmount,
    shipping,
    tax,
    grandTotal,
    appliedPromo,
  };
}
