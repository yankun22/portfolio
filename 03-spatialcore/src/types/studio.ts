import type { ProductPartId } from './product';

export type CameraPresetId = 'iso' | 'side' | 'top' | 'front' | 'heel' | 'detail';

export type StudioLightingMode = 'studio' | 'cyberpunk' | 'warmSunset' | 'monochrome';

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface StudioState {
  activePartId: ProductPartId;
  isExploded: boolean;
  autoRotate: boolean;
  wireframeMode: boolean;
  lightingMode: StudioLightingMode;
  cameraPreset: CameraPresetId;
}
