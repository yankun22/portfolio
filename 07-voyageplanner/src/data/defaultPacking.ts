import type { PackingCategory, PackingItem } from '../types/packing';

export interface PackingTemplateItem {
  category: PackingCategory;
  name: string;
  quantity: number;
  essential: boolean;
  notes?: string;
  condition?: 'rain' | 'cold' | 'hot' | 'general' | 'beach' | 'hiking';
}

export const BASE_PACKING_TEMPLATE: PackingTemplateItem[] = [
  // Documents & Passports
  { category: 'Documents & Passports', name: 'Passport & Visa Copies (Physical + Digital)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Documents & Passports', name: 'Flight Boarding Passes & Hotel Confirmations', quantity: 1, essential: true, condition: 'general' },
  { category: 'Documents & Passports', name: 'Travel Health Insurance Cards / Policy PDF', quantity: 1, essential: true, condition: 'general' },
  { category: 'Documents & Passports', name: 'International Driving Permit (IDP)', quantity: 1, essential: false, condition: 'general' },
  { category: 'Documents & Passports', name: 'Credit Cards (Zero Foreign FX Fee) & Local Cash', quantity: 2, essential: true, condition: 'general' },

  // Clothing & Footwear
  { category: 'Clothing & Footwear', name: 'Comfortable Walking / Running Sneakers', quantity: 1, essential: true, condition: 'general' },
  { category: 'Clothing & Footwear', name: 'Moisture-Wicking T-Shirts / Tops', quantity: 5, essential: true, condition: 'general' },
  { category: 'Clothing & Footwear', name: 'Breathable Pants / Chinos / Travel Jeans', quantity: 3, essential: true, condition: 'general' },
  { category: 'Clothing & Footwear', name: 'Underwear & Socks Pack', quantity: 7, essential: true, condition: 'general' },
  { category: 'Clothing & Footwear', name: 'Compact Waterproof Rain Shell Jacket', quantity: 1, essential: true, condition: 'rain' },
  { category: 'Clothing & Footwear', name: 'Windproof Umbrella', quantity: 1, essential: false, condition: 'rain' },
  { category: 'Clothing & Footwear', name: 'Thermal Base Layer & Fleece Hoodie', quantity: 2, essential: true, condition: 'cold' },
  { category: 'Clothing & Footwear', name: 'Down Puffer Jacket & Beanie', quantity: 1, essential: true, condition: 'cold' },
  { category: 'Clothing & Footwear', name: 'UV Swimwear & Microfiber Beach Towel', quantity: 2, essential: false, condition: 'beach' },
  { category: 'Clothing & Footwear', name: 'Sturdy Waterproof Hiking Boots', quantity: 1, essential: true, condition: 'hiking' },

  // Electronics & Tech
  { category: 'Electronics & Tech', name: 'Universal Travel Power Adapter (GaN Fast Charger)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Electronics & Tech', name: 'High-Capacity Power Bank (20,000mAh PD)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Electronics & Tech', name: 'USB-C / Lightning Charging Cables (Braided)', quantity: 3, essential: true, condition: 'general' },
  { category: 'Electronics & Tech', name: 'Noise-Cancelling Headphones / AirPods', quantity: 1, essential: true, condition: 'general' },
  { category: 'Electronics & Tech', name: 'eSIM QR Code / Pocket Wi-Fi Router', quantity: 1, essential: true, condition: 'general' },
  { category: 'Electronics & Tech', name: 'Mirrorless Camera & Extra SD Cards', quantity: 1, essential: false, condition: 'general' },

  // Toiletries & Health
  { category: 'Toiletries & Health', name: 'TSA-Compliant Travel Toiletry Kit', quantity: 1, essential: true, condition: 'general' },
  { category: 'Toiletries & Health', name: 'Broad Spectrum SPF 50+ Sunscreen', quantity: 1, essential: true, condition: 'general' },
  { category: 'Toiletries & Health', name: 'Personal Prescription Medications & Pain Relievers', quantity: 1, essential: true, condition: 'general' },
  { category: 'Toiletries & Health', name: 'Electrolyte Hydration Tablets & Motion Sickness Pills', quantity: 1, essential: false, condition: 'general' },
  { category: 'Toiletries & Health', name: 'Hand Sanitizer & Antibacterial Wet Wipes', quantity: 2, essential: true, condition: 'general' },

  // Outdoor & Activity Gear
  { category: 'Outdoor & Activity Gear', name: 'Lightweight Packable Daypack (20L)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Outdoor & Activity Gear', name: 'Reusable Insulated Water Bottle (750ml)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Outdoor & Activity Gear', name: 'Polarized Sunglasses with UV400 Protection', quantity: 1, essential: true, condition: 'general' },
  { category: 'Outdoor & Activity Gear', name: 'Trekking Poles & Trail Headlamp', quantity: 1, essential: false, condition: 'hiking' },

  // Emergency & Meds
  { category: 'Emergency & Meds', name: 'Compact First Aid Kit (Bandages, Antiseptic, Gauze)', quantity: 1, essential: true, condition: 'general' },
  { category: 'Emergency & Meds', name: 'Emergency Whistle & Mini Multi-Tool', quantity: 1, essential: false, condition: 'general' }
];

export function generateDefaultPackingList(tripId: string): PackingItem[] {
  return BASE_PACKING_TEMPLATE.map((tpl, idx) => ({
    id: `pack-${tripId}-${idx + 1}`,
    tripId,
    category: tpl.category,
    name: tpl.name,
    quantity: tpl.quantity,
    packed: idx % 3 === 0,
    essential: tpl.essential,
    notes: tpl.notes || ''
  }));
}
