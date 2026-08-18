export type ProductPartId = 'upper' | 'sole' | 'cushion' | 'cage' | 'heel' | 'laces';

export type MaterialTierId = 'leather' | 'carbon' | 'titanium' | 'polycarbonate' | 'iridescent';

export interface PbrProperties {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  wireframe?: boolean;
}

export interface MaterialTier {
  id: MaterialTierId;
  name: string;
  badge: string;
  priceAddon: number;
  description: string;
  pbr: PbrProperties;
  swatchGradient: string;
}

export interface PartConfig {
  material: MaterialTierId;
  color: string;
}

export type ProductConfig = Record<ProductPartId, PartConfig>;

export interface PartMeta {
  id: ProductPartId;
  name: string;
  subtitle: string;
  defaultMaterial: MaterialTierId;
  defaultColor: string;
  explodeVector: [number, number, number];
  annotationOffset: [number, number, number];
  specTitle: string;
  specDescription: string;
}

export interface PresetDesign {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  thumbnailColor: string;
  config: ProductConfig;
}
