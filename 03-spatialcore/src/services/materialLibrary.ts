import * as THREE from 'three';
import type { MaterialTier, MaterialTierId, PartMeta, PresetDesign } from '../types/product';

// Procedural Carbon Fiber Texture Generator
function createCarbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#181818';
    ctx.fillRect(0, 0, 64, 64);

    // Diagonal twill weave pattern
    ctx.fillStyle = '#2e2e2e';
    for (let x = 0; x < 64; x += 8) {
      for (let y = 0; y < 64; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 4, 4);
          ctx.fillRect(x + 4, y + 4, 4, 4);
        }
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// Procedural Leather Grain Normal/Bump Generator
function createLeatherBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);

    // Micro-grain cells
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? '#606060' : '#a0a0a0';
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

const carbonTextureCache = createCarbonTexture();
const leatherBumpCache = createLeatherBumpTexture();

export const MATERIAL_TIERS: Record<MaterialTierId, MaterialTier> = {
  leather: {
    id: 'leather',
    name: 'Matte Ultra-Leather',
    badge: 'Standard Tier',
    priceAddon: 0,
    description: 'Supple full-grain synthetic leather with micro-perforated breathability and soft matte finish.',
    pbr: {
      roughness: 0.65,
      metalness: 0.05,
      clearcoat: 0.1,
      clearcoatRoughness: 0.4,
    },
    swatchGradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
  },
  carbon: {
    id: 'carbon',
    name: 'Aero Carbon Fiber',
    badge: 'Pro Tier (+$45)',
    priceAddon: 45,
    description: '3K twill carbon weave with high-gloss resin clearcoat for extreme rigidity and featherweight response.',
    pbr: {
      roughness: 0.25,
      metalness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    },
    swatchGradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #09090b 100%)',
  },
  titanium: {
    id: 'titanium',
    name: 'Aerospace Titanium',
    badge: 'Elite Tier (+$60)',
    priceAddon: 60,
    description: 'Anodized brushed titanium alloy delivering industrial sheen with cryogenic thermal resilience.',
    pbr: {
      roughness: 0.22,
      metalness: 0.95,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    },
    swatchGradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)',
  },
  polycarbonate: {
    id: 'polycarbonate',
    name: 'Cyber Polycarbonate',
    badge: 'Translucent (+$35)',
    priceAddon: 35,
    description: 'High-index optical polymer showcasing internal pneumatic suspension channels.',
    pbr: {
      roughness: 0.12,
      metalness: 0.05,
      transmission: 0.88,
      ior: 1.52,
      thickness: 1.2,
      clearcoat: 1.0,
    },
    swatchGradient: 'linear-gradient(135deg, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.3) 100%)',
  },
  iridescent: {
    id: 'iridescent',
    name: 'Chameleon Chrome',
    badge: 'Custom Flux (+$55)',
    priceAddon: 55,
    description: 'Nano-optic prismatic coating that shifts hues dynamically with viewing angle and lighting.',
    pbr: {
      roughness: 0.14,
      metalness: 0.85,
      iridescence: 1.0,
      iridescenceIOR: 1.65,
      clearcoat: 0.8,
    },
    swatchGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
  },
};

export const PART_METADATA: PartMeta[] = [
  {
    id: 'upper',
    name: 'Upper Shell Chassis',
    subtitle: 'Anatomical shell with targeted flex zones',
    defaultMaterial: 'leather',
    defaultColor: '#1e293b',
    explodeVector: [0, 0.4, 0],
    annotationOffset: [0, 1.2, 0.8],
    specTitle: 'Seamless Matrix Upper',
    specDescription: 'Ultralight composite matrix engineered with thermo-bonded tensile microfibers.',
  },
  {
    id: 'sole',
    name: 'Outsole & Traction Tread',
    subtitle: 'Multi-directional hexagonal grip outsole',
    defaultMaterial: 'carbon',
    defaultColor: '#0f172a',
    explodeVector: [0, -1.8, 0],
    annotationOffset: [0, -2.2, 0.5],
    specTitle: 'High-Density Grip Outsole',
    specDescription: 'Abrasion-resistant compound with decoupled flex grooves for maximum traction.',
  },
  {
    id: 'cushion',
    name: 'Pneumatic Cushion Pods',
    subtitle: 'Honeycomb air-suspension impact dampeners',
    defaultMaterial: 'polycarbonate',
    defaultColor: '#00f0ff',
    explodeVector: [0, -0.9, 0],
    annotationOffset: [0.8, -1.1, 0.8],
    specTitle: 'Air-Matrix Dampening Unit',
    specDescription: 'Dual-chamber nitrogen pressurized suspension pods with 85% kinetic energy return.',
  },
  {
    id: 'cage',
    name: 'Exoskeleton Support Cage',
    subtitle: 'Lateral containment & arch stabilization wings',
    defaultMaterial: 'titanium',
    defaultColor: '#e2e8f0',
    explodeVector: [1.2, 0.6, 0.4],
    annotationOffset: [1.6, 0.8, 0.6],
    specTitle: 'Titanium Exoskeleton Cage',
    specDescription: 'Cryo-formed support ribbing locks the midfoot securely during lateral shear loads.',
  },
  {
    id: 'heel',
    name: 'Heel Stabilizer & Shank',
    subtitle: 'Energy-return torsional heel counter',
    defaultMaterial: 'carbon',
    defaultColor: '#0f172a',
    explodeVector: [-1.4, 0.3, 0],
    annotationOffset: [-1.8, 0.5, 0.4],
    specTitle: 'Carbon Torsion Shank',
    specDescription: 'Molded carbon fiber stabilizer cup prevents heel slippage and pronation.',
  },
  {
    id: 'laces',
    name: 'Precision Dial & Tension Cables',
    subtitle: 'Micro-adjustable BOA fit system',
    defaultMaterial: 'titanium',
    defaultColor: '#00f0ff',
    explodeVector: [0.5, 1.4, 0],
    annotationOffset: [0.6, 1.8, 0.4],
    specTitle: 'BOA Dial Lacing Rig',
    specDescription: 'Aircraft-grade stainless steel cables with millimeter-precision rotary dial tensioner.',
  },
];

export const COLOR_PALETTES = [
  { name: 'Cyber Cyan', hex: '#00f0ff' },
  { name: 'Neon Emerald', hex: '#10b981' },
  { name: 'Cosmic Violet', hex: '#8b5cf6' },
  { name: 'Laser Magenta', hex: '#ec4899' },
  { name: 'Solar Amber', hex: '#f59e0b' },
  { name: 'Stealth Obsidian', hex: '#0f172a' },
  { name: 'Space Graphite', hex: '#334155' },
  { name: 'Titanium Platinum', hex: '#e2e8f0' },
  { name: 'Ghost White', hex: '#ffffff' },
  { name: 'Magma Crimson', hex: '#ef4444' },
  { name: 'Deep Cobalt', hex: '#2563eb' },
  { name: 'Acid Volt', hex: '#84cc16' },
];

export const DESIGNER_PRESETS: PresetDesign[] = [
  {
    id: 'stealth-noir',
    name: 'Stealth Noir 01',
    tagline: 'Carbon Fiber & Matte Obsidian Matrix',
    badge: 'Signature',
    thumbnailColor: '#18181b',
    config: {
      upper: { material: 'leather', color: '#0f172a' },
      sole: { material: 'carbon', color: '#18181b' },
      cushion: { material: 'carbon', color: '#09090b' },
      cage: { material: 'titanium', color: '#334155' },
      heel: { material: 'carbon', color: '#18181b' },
      laces: { material: 'leather', color: '#0f172a' },
    },
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan Apex',
    tagline: 'Electric Teal with Translucent Nitrogen Pods',
    badge: 'Most Popular',
    thumbnailColor: '#00f0ff',
    config: {
      upper: { material: 'leather', color: '#0f172a' },
      sole: { material: 'carbon', color: '#1e293b' },
      cushion: { material: 'polycarbonate', color: '#00f0ff' },
      cage: { material: 'titanium', color: '#e2e8f0' },
      heel: { material: 'carbon', color: '#0f172a' },
      laces: { material: 'titanium', color: '#00f0ff' },
    },
  },
  {
    id: 'neon-sunset',
    name: 'Neon Sunset Flux',
    tagline: 'Chameleon Iridescence with Laser Pink Accents',
    badge: 'Limited Edition',
    thumbnailColor: '#ec4899',
    config: {
      upper: { material: 'iridescent', color: '#8b5cf6' },
      sole: { material: 'leather', color: '#0f172a' },
      cushion: { material: 'polycarbonate', color: '#ec4899' },
      cage: { material: 'iridescent', color: '#ec4899' },
      heel: { material: 'carbon', color: '#1e1b4b' },
      laces: { material: 'titanium', color: '#f59e0b' },
    },
  },
  {
    id: 'solar-gold',
    name: 'Solar Royal Chrome',
    tagline: 'Aerospace Gold & Platinum Titanium Exoskeleton',
    badge: 'Luxury Tier',
    thumbnailColor: '#f59e0b',
    config: {
      upper: { material: 'leather', color: '#ffffff' },
      sole: { material: 'carbon', color: '#1e293b' },
      cushion: { material: 'polycarbonate', color: '#f59e0b' },
      cage: { material: 'titanium', color: '#f59e0b' },
      heel: { material: 'titanium', color: '#cbd5e1' },
      laces: { material: 'titanium', color: '#f59e0b' },
    },
  },
];

/**
 * Creates or updates a Three.js PBR material based on material tier and color
 */
export function createPbrMaterial(
  tierId: MaterialTierId,
  colorHex: string,
  wireframe: boolean = false
): THREE.Material {
  const tier = MATERIAL_TIERS[tierId];
  const color = new THREE.Color(colorHex);

  if (tierId === 'carbon') {
    return new THREE.MeshPhysicalMaterial({
      color: color.clone().multiplyScalar(0.7),
      roughness: tier.pbr.roughness,
      metalness: tier.pbr.metalness,
      clearcoat: tier.pbr.clearcoat,
      clearcoatRoughness: tier.pbr.clearcoatRoughness,
      bumpMap: carbonTextureCache,
      bumpScale: 0.04,
      wireframe,
    });
  }

  if (tierId === 'polycarbonate') {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: tier.pbr.roughness,
      metalness: tier.pbr.metalness,
      transmission: tier.pbr.transmission,
      ior: tier.pbr.ior,
      thickness: tier.pbr.thickness,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      wireframe,
    });
  }

  if (tierId === 'iridescent') {
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: tier.pbr.roughness,
      metalness: tier.pbr.metalness,
      iridescence: tier.pbr.iridescence,
      iridescenceIOR: tier.pbr.iridescenceIOR,
      clearcoat: tier.pbr.clearcoat,
      wireframe,
    });
  }

  if (tierId === 'titanium') {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: tier.pbr.roughness,
      metalness: tier.pbr.metalness,
      wireframe,
    });
  }

  // Default Matte Leather
  return new THREE.MeshStandardMaterial({
    color,
    roughness: tier.pbr.roughness,
    metalness: tier.pbr.metalness,
    bumpMap: leatherBumpCache,
    bumpScale: 0.015,
    wireframe,
  });
}
