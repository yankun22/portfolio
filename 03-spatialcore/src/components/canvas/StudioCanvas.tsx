import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ProductPartId } from '../../types/product';
import type { CameraPresetId, StudioLightingMode } from '../../types/studio';
import { createProceduralShoe, type ShoeAssembly } from '../../services/modelGenerator';
import { createPbrMaterial, PART_METADATA } from '../../services/materialLibrary';
import { useStudio } from '../../context/useStudio';
import { AnnotationOverlay, type ProjectedAnnotation } from './AnnotationOverlay';

const CAMERA_POSITIONS: Record<CameraPresetId, { pos: [number, number, number]; target: [number, number, number] }> = {
  iso: { pos: [4.2, 2.5, 4.2], target: [0, 0, 0] },
  side: { pos: [0, 0.5, 5.5], target: [0, 0, 0] },
  top: { pos: [0, 6.0, 0.2], target: [0, 0, 0] },
  front: { pos: [5.2, 0.6, 0], target: [0, 0, 0] },
  heel: { pos: [-5.2, 0.6, 0], target: [0, 0, 0] },
  detail: { pos: [1.8, 1.8, 2.2], target: [0.2, 0.4, 0] },
};

export const StudioCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    productConfig,
    setActivePartId,
    isExploded,
    autoRotate,
    wireframeMode,
    lightingMode,
    cameraPreset,
  } = useStudio();

  const [projectedPoints, setProjectedPoints] = useState<Record<ProductPartId, ProjectedAnnotation>>(
    {} as Record<ProductPartId, ProjectedAnnotation>
  );

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shoeAssemblyRef = useRef<ShoeAssembly | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  const isExplodedRef = useRef(isExploded);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Initialize Three.js Scene, Camera, Renderer, Controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(...CAMERA_POSITIONS.iso.pos);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;  // Clamped for mobile to prevent zoom-out too far
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    // On mobile, disable pan so single-finger can rotate without trapping scroll
    if (window.innerWidth < 768) {
      controls.enablePan = false;
    }
    controlsRef.current = controls;

    // 5. Lighting Setup Group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    setupLighting(lightsGroup, 'studio');

    // 6. Ground Studio Pedestal Plane
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Studio Circular Floor Ring Grid
    const ringGeo = new THREE.RingGeometry(2.4, 2.45, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.19;
    scene.add(ring);

    // 7. Procedural 3D Shoe Model
    const shoe = createProceduralShoe();
    scene.add(shoe.rootGroup);
    shoeAssemblyRef.current = shoe;

    // 8. Animation & Render Loop
    let animId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Auto-Rotate
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      // Exploded View Spring / Lerp Animation
      if (shoeAssemblyRef.current) {
        const parts = shoeAssemblyRef.current.parts;
        const pts: Record<ProductPartId, ProjectedAnnotation> = {} as any;
        const currentExploded = isExplodedRef.current;

        (Object.keys(parts) as ProductPartId[]).forEach((partId) => {
          const part = parts[partId];
          const target = currentExploded ? part.explodedPosition : part.basePosition;

          // Smooth lerp transition
          part.currentPosition.lerp(target, 0.08);
          part.group.position.copy(part.currentPosition);

          // Calculate screen-space projection for annotation pin
          if (cameraRef.current && containerRef.current) {
            const meta = PART_METADATA.find((m) => m.id === partId);
            if (meta) {
              tempVec.set(...meta.annotationOffset).add(part.currentPosition);
              tempVec.project(cameraRef.current);

              const halfW = containerRef.current.clientWidth / 2;
              const halfH = containerRef.current.clientHeight / 2;
              const screenX = tempVec.x * halfW + halfW;
              const screenY = -tempVec.y * halfH + halfH;
              const isVisible = tempVec.z < 1.0;

              pts[partId] = {
                id: partId,
                x: screenX,
                y: screenY,
                visible: isVisible,
              };
            }
          }
        });

        if (currentExploded) {
          setProjectedPoints(pts);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Materials when productConfig or wireframeMode changes
  useEffect(() => {
    if (!shoeAssemblyRef.current) return;
    const parts = shoeAssemblyRef.current.parts;

    (Object.keys(parts) as ProductPartId[]).forEach((partId) => {
      const part = parts[partId];
      const conf = productConfig[partId];
      const mat = createPbrMaterial(conf.material, conf.color, wireframeMode);

      part.meshes.forEach((mesh) => {
        mesh.material = mat;
      });
    });
  }, [productConfig, wireframeMode]);

  // Update Studio Lighting Mode
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    setupLighting(lightsGroupRef.current, lightingMode);
  }, [lightingMode]);

  // Update Camera View Preset
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const preset = CAMERA_POSITIONS[cameraPreset] || CAMERA_POSITIONS.iso;

    cameraRef.current.position.set(...preset.pos);
    controlsRef.current.target.set(...preset.target);
    controlsRef.current.update();
  }, [cameraPreset]);

  // Raycaster to select 3D part on click
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current || !cameraRef.current || !shoeAssemblyRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

      const parts = shoeAssemblyRef.current.parts;
      for (const partId of Object.keys(parts) as ProductPartId[]) {
        const intersects = raycaster.intersectObjects(parts[partId].meshes, true);
        if (intersects.length > 0) {
          setActivePartId(partId);
          break;
        }
      }
    },
    [setActivePartId]
  );

  return (
    <div
      ref={containerRef}
      className="canvas-viewport"
      onPointerDown={handlePointerDown}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <AnnotationOverlay projectedPoints={projectedPoints} />
    </div>
  );
};

function setupLighting(group: THREE.Group, mode: StudioLightingMode) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  if (mode === 'cyberpunk') {
    const ambLight = new THREE.AmbientLight(0x0f172a, 1.2);
    group.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 3.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0001;
    group.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 4.0);
    rimLight.position.set(-5, 4, -4);
    group.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    fillLight.position.set(0, -3, 3);
    group.add(fillLight);
  } else if (mode === 'warmSunset') {
    const ambLight = new THREE.AmbientLight(0x2a1a10, 1.2);
    group.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xf59e0b, 3.8);
    keyLight.position.set(5, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    group.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xec4899, 2.5);
    rimLight.position.set(-4, 3, -4);
    group.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xd97706, 1.5);
    fillLight.position.set(-2, -1, 3);
    group.add(fillLight);
  } else if (mode === 'monochrome') {
    const ambLight = new THREE.AmbientLight(0xffffff, 1.0);
    group.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    group.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(-4, 3, -3);
    group.add(rimLight);
  } else {
    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    group.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 5.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0001;
    group.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    rimLight.position.set(-4.5, 4, -4);
    group.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 1.4);
    fillLight.position.set(0, 3, 5);
    group.add(fillLight);
  }
}
