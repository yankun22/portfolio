import type { ProductConfig } from './product';

export interface CartItem {
  id: string;
  name: string;
  config: ProductConfig;
  unitPrice: number;
  quantity: number;
  size: string;
  timestamp: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export interface CheckoutFormState {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'applepay' | 'crypto';
}
