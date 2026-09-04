import { SchemaDefinition } from '../types/schema';

export const BASELINE_SCHEMA_V1: SchemaDefinition = {
  version: 1,
  namespace: 'com.eventpulse.orders',
  name: 'OrderCompletedEvent',
  type: 'record',
  fields: [
    { name: 'orderId', type: 'string', required: true, description: 'Unique order UUID' },
    { name: 'customerId', type: 'string', required: true, description: 'Customer account ID' },
    { name: 'totalAmountCents', type: 'integer', required: true, description: 'Transaction total in integer cents' },
    { name: 'currency', type: 'string', required: true, defaultValue: 'USD', description: 'ISO 4217 3-letter currency code' },
    { name: 'itemCount', type: 'integer', required: true, description: 'Count of line items purchased' },
    { name: 'shippingAddress', type: 'string', required: false, defaultValue: null, description: 'Primary physical shipping address' },
    { name: 'paymentMethod', type: 'string', required: true, description: 'Tokenized credit card or crypto gateway' },
    { name: 'timestamp', type: 'integer', required: true, description: 'Epoch millisecond timestamp' },
  ],
};

export const SCHEMA_PRESET_COMPATIBLE: SchemaDefinition = {
  version: 2,
  namespace: 'com.eventpulse.orders',
  name: 'OrderCompletedEvent',
  type: 'record',
  fields: [
    { name: 'orderId', type: 'string', required: true, description: 'Unique order UUID' },
    { name: 'customerId', type: 'string', required: true, description: 'Customer account ID' },
    { name: 'totalAmountCents', type: 'integer', required: true, description: 'Transaction total in integer cents' },
    { name: 'currency', type: 'string', required: true, defaultValue: 'USD', description: 'ISO 4217 3-letter currency code' },
    { name: 'itemCount', type: 'integer', required: true, description: 'Count of line items purchased' },
    { name: 'shippingAddress', type: 'string', required: false, defaultValue: null, description: 'Primary physical shipping address' },
    { name: 'paymentMethod', type: 'string', required: true, description: 'Tokenized credit card or crypto gateway' },
    { name: 'timestamp', type: 'integer', required: true, description: 'Epoch millisecond timestamp' },
    // Safe optional additions
    { name: 'loyaltyTier', type: 'string', required: false, defaultValue: 'STANDARD', description: 'Customer VIP/Loyalty status' },
    { name: 'promoDiscountCents', type: 'integer', required: false, defaultValue: 0, description: 'Applied discount coupon in cents' },
  ],
};

export const SCHEMA_PRESET_BREAKING_DELETION: SchemaDefinition = {
  version: 2,
  namespace: 'com.eventpulse.orders',
  name: 'OrderCompletedEvent',
  type: 'record',
  fields: [
    { name: 'orderId', type: 'string', required: true, description: 'Unique order UUID' },
    // BREAKING: customerId DELETED!
    // BREAKING: totalAmountCents DELETED!
    { name: 'currency', type: 'string', required: true, defaultValue: 'USD', description: 'ISO 4217 3-letter currency code' },
    { name: 'itemCount', type: 'integer', required: true, description: 'Count of line items purchased' },
    { name: 'paymentMethod', type: 'string', required: true, description: 'Tokenized credit card or crypto gateway' },
    { name: 'timestamp', type: 'integer', required: true, description: 'Epoch millisecond timestamp' },
  ],
};

export const SCHEMA_PRESET_TYPE_MUTATION: SchemaDefinition = {
  version: 2,
  namespace: 'com.eventpulse.orders',
  name: 'OrderCompletedEvent',
  type: 'record',
  fields: [
    { name: 'orderId', type: 'string', required: true, description: 'Unique order UUID' },
    { name: 'customerId', type: 'string', required: true, description: 'Customer account ID' },
    // BREAKING: totalAmountCents mutated from integer to string!
    { name: 'totalAmountCents', type: 'string', required: true, description: 'Transaction total as string with decimal (e.g. "49.99")' },
    { name: 'currency', type: 'string', required: true, defaultValue: 'USD', description: 'ISO 4217 3-letter currency code' },
    // BREAKING: itemCount mutated from integer to array!
    { name: 'itemCount', type: 'array', required: true, description: 'Array of item SKUs instead of integer count' },
    { name: 'paymentMethod', type: 'string', required: true, description: 'Tokenized credit card or crypto gateway' },
    { name: 'timestamp', type: 'integer', required: true, description: 'Epoch millisecond timestamp' },
  ],
};

export const SCHEMA_PRESET_REQUIRED_NO_DEFAULT: SchemaDefinition = {
  version: 2,
  namespace: 'com.eventpulse.orders',
  name: 'OrderCompletedEvent',
  type: 'record',
  fields: [
    { name: 'orderId', type: 'string', required: true, description: 'Unique order UUID' },
    { name: 'customerId', type: 'string', required: true, description: 'Customer account ID' },
    { name: 'totalAmountCents', type: 'integer', required: true, description: 'Transaction total in integer cents' },
    { name: 'currency', type: 'string', required: true, defaultValue: 'USD', description: 'ISO 4217 3-letter currency code' },
    { name: 'itemCount', type: 'integer', required: true, description: 'Count of line items purchased' },
    { name: 'paymentMethod', type: 'string', required: true, description: 'Tokenized credit card or crypto gateway' },
    { name: 'timestamp', type: 'integer', required: true, description: 'Epoch millisecond timestamp' },
    // BREAKING: Required field added without default value!
    { name: 'taxJurisdictionCode', type: 'string', required: true, description: 'Mandatory state/federal tax jurisdiction' },
  ],
};
