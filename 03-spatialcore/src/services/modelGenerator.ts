import * as THREE from 'three';
import type { ProductPartId } from '../types/product';
import { PART_METADATA } from './materialLibrary';

export interface ShoePartMeshGroup {
  id: ProductPartId;
  group: THREE.Group;
  basePosition: THREE.Vector3;
  explodedPosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
  meshes: THREE.Mesh[];
}

export interface ShoeAssembly {
  rootGroup: THREE.Group;
  parts: Record<ProductPartId, ShoePartMeshGroup>;
}

export function createProceduralShoe(): ShoeAssembly {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SpatialPulse_Apex_01';

  const parts = {} as Record<ProductPartId, ShoePartMeshGroup>;

  PART_METADATA.forEach((meta) => {
    const group = new THREE.Group();
    group.name = `part_${meta.id}`;

    const basePos = new THREE.Vector3(0, 0, 0);
    const explodePos = new THREE.Vector3(...meta.explodeVector);

    group.position.copy(basePos);
    rootGroup.add(group);

    parts[meta.id] = {
      id: meta.id,
      group,
      basePosition: basePos,
      explodedPosition: explodePos,
      currentPosition: basePos.clone(),
      meshes: [],
    };
  });

  // --- 1. SOLE / OUTSOLE (Aerodynamic Base Tread) ---
  const soleShape = new THREE.Shape();
  soleShape.moveTo(-2.2, 0);
  soleShape.lineTo(2.0, 0);
  soleShape.quadraticCurveTo(2.5, 0.1, 2.6, 0.4);
  soleShape.quadraticCurveTo(2.3, 0.5, 1.8, 0.45);
  soleShape.lineTo(-1.8, 0.45);
  soleShape.quadraticCurveTo(-2.3, 0.35, -2.2, 0);

  const soleExtrudeSettings = {
    steps: 2,
    depth: 1.4,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.12,
    bevelSegments: 4,
  };

  const soleGeo = new THREE.ExtrudeGeometry(soleShape, soleExtrudeSettings);
  soleGeo.center();
  const soleMesh = new THREE.Mesh(soleGeo, new THREE.MeshStandardMaterial());
  soleMesh.castShadow = true;
  soleMesh.receiveShadow = true;
  soleMesh.position.set(0, -0.65, 0);
  parts['sole'].group.add(soleMesh);
  parts['sole'].meshes.push(soleMesh);

  // Add Sole Grip Traction Nodes
  for (let i = -1.6; i <= 1.6; i += 0.5) {
    const treadGeo = new THREE.BoxGeometry(0.25, 0.08, 1.1);
    const treadMesh = new THREE.Mesh(treadGeo, new THREE.MeshStandardMaterial());
    treadMesh.position.set(i, -0.88, 0);
    parts['sole'].group.add(treadMesh);
    parts['sole'].meshes.push(treadMesh);
  }

  // --- 2. CUSHIONING (Honeycomb Pneumatic Air Pods) ---
  // Forefoot Pods & Heel Pod
  const podPositions: [number, number, number][] = [
    [-1.2, -0.32, 0.35],
    [-1.2, -0.32, -0.35],
    [0.2, -0.32, 0.35],
    [0.2, -0.32, -0.35],
    [1.0, -0.32, 0.3],
    [1.0, -0.32, -0.3],
  ];

  podPositions.forEach((pos) => {
    const podGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.28, 16);
    const podMesh = new THREE.Mesh(podGeo, new THREE.MeshPhysicalMaterial());
    podMesh.rotation.x = Math.PI / 2;
    podMesh.position.set(...pos);
    podMesh.castShadow = true;
    parts['cushion'].group.add(podMesh);
    parts['cushion'].meshes.push(podMesh);
  });

  // Central suspension bridge tube
  const bridgeGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, new THREE.MeshPhysicalMaterial());
  bridgeMesh.rotation.z = Math.PI / 2;
  bridgeMesh.position.set(-0.1, -0.32, 0);
  parts['cushion'].group.add(bridgeMesh);
  parts['cushion'].meshes.push(bridgeMesh);

  // --- 3. UPPER SHELL (Streamlined Body Chassis) ---
  const upperShape = new THREE.Shape();
  upperShape.moveTo(-2.0, 0);
  upperShape.lineTo(1.8, 0);
  upperShape.quadraticCurveTo(2.3, 0.2, 2.1, 0.7); // Toe box
  upperShape.quadraticCurveTo(1.2, 1.4, 0.2, 1.5); // Instep
  upperShape.quadraticCurveTo(-0.6, 1.8, -1.5, 1.6); // Ankle collar
  upperShape.quadraticCurveTo(-2.1, 1.2, -2.0, 0); // Heel curve

  const upperExtrudeSettings = {
    steps: 4,
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.15,
    bevelSegments: 5,
  };

  const upperGeo = new THREE.ExtrudeGeometry(upperShape, upperExtrudeSettings);
  upperGeo.center();
  const upperMesh = new THREE.Mesh(upperGeo, new THREE.MeshStandardMaterial());
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperMesh.position.set(0, 0.2, 0);
  parts['upper'].group.add(upperMesh);
  parts['upper'].meshes.push(upperMesh);

  // Toe Cap Overlay Reinforcement
  const toeGeo = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const toeMesh = new THREE.Mesh(toeGeo, new THREE.MeshStandardMaterial());
  toeMesh.rotation.z = -Math.PI / 2.8;
  toeMesh.position.set(1.5, 0.35, 0);
  toeMesh.scale.set(0.9, 0.7, 1.1);
  parts['upper'].group.add(toeMesh);
  parts['upper'].meshes.push(toeMesh);

  // --- 4. EXOSKELETON CAGE (Lateral Support Wings & Ribs) ---
  const cageRibOffsets = [
    { x: -0.5, y: 0.3, z: 0.65, rot: 0.3 },
    { x: 0.1, y: 0.4, z: 0.65, rot: 0.2 },
    { x: 0.7, y: 0.35, z: 0.65, rot: 0.1 },
    { x: -0.5, y: 0.3, z: -0.65, rot: -0.3 },
    { x: 0.1, y: 0.4, z: -0.65, rot: -0.2 },
    { x: 0.7, y: 0.35, z: -0.65, rot: -0.1 },
  ];

  cageRibOffsets.forEach((rib) => {
    const ribGeo = new THREE.BoxGeometry(0.18, 0.85, 0.12);
    const ribMesh = new THREE.Mesh(ribGeo, new THREE.MeshStandardMaterial());
    ribMesh.position.set(rib.x, rib.y, rib.z);
    ribMesh.rotation.z = rib.rot;
    ribMesh.castShadow = true;
    parts['cage'].group.add(ribMesh);
    parts['cage'].meshes.push(ribMesh);
  });

  // Lateral connecting wing plate
  const wingGeo = new THREE.TorusGeometry(0.8, 0.08, 8, 24, Math.PI);
  const wingMeshL = new THREE.Mesh(wingGeo, new THREE.MeshStandardMaterial());
  wingMeshL.position.set(0.1, 0.25, 0.65);
  wingMeshL.rotation.y = 0;
  parts['cage'].group.add(wingMeshL);
  parts['cage'].meshes.push(wingMeshL);

  const wingMeshR = new THREE.Mesh(wingGeo, new THREE.MeshStandardMaterial());
  wingMeshR.position.set(0.1, 0.25, -0.65);
  wingMeshR.rotation.y = Math.PI;
  parts['cage'].group.add(wingMeshR);
  parts['cage'].meshes.push(wingMeshR);

  // --- 5. HEEL STABILIZER & SHANK ---
  const heelCupGeo = new THREE.CylinderGeometry(0.65, 0.72, 0.9, 24, 1, true, 0, Math.PI);
  const heelCupMesh = new THREE.Mesh(heelCupGeo, new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }));
  heelCupMesh.position.set(-1.45, 0.3, 0);
  heelCupMesh.rotation.y = Math.PI / 2;
  heelCupMesh.castShadow = true;
  parts['heel'].group.add(heelCupMesh);
  parts['heel'].meshes.push(heelCupMesh);

  // Heel Pull-Loop Tab
  const loopGeo = new THREE.TorusGeometry(0.28, 0.05, 8, 20);
  const loopMesh = new THREE.Mesh(loopGeo, new THREE.MeshStandardMaterial());
  loopMesh.position.set(-1.95, 0.95, 0);
  loopMesh.rotation.y = Math.PI / 2;
  parts['heel'].group.add(loopMesh);
  parts['heel'].meshes.push(loopMesh);

  // --- 6. PRECISION BOA LACING & TENSION CABLES ---
  // Lacing tension cables
  const laceAngles = [
    { x1: -0.2, y1: 0.95, z1: -0.4, x2: 0.1, y2: 0.9, z2: 0.4 },
    { x1: 0.1, y1: 0.9, z1: -0.4, x2: 0.4, y2: 0.85, z2: 0.4 },
    { x1: 0.4, y1: 0.85, z1: -0.4, x2: 0.7, y2: 0.75, z2: 0.4 },
  ];

  laceAngles.forEach((lace) => {
    const p1 = new THREE.Vector3(lace.x1, lace.y1, lace.z1);
    const p2 = new THREE.Vector3(lace.x2, lace.y2, lace.z2);
    const distance = p1.distanceTo(p2);
    const cableGeo = new THREE.CylinderGeometry(0.025, 0.025, distance, 8);
    const cableMesh = new THREE.Mesh(cableGeo, new THREE.MeshStandardMaterial());

    // Position midway and orient toward p2
    cableMesh.position.copy(p1).add(p2).multiplyScalar(0.5);
    cableMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
    cableMesh.castShadow = true;
    parts['laces'].group.add(cableMesh);
    parts['laces'].meshes.push(cableMesh);
  });

  // BOA Rotary Dial Hub on tongue
  const dialHubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
  const dialHubMesh = new THREE.Mesh(dialHubGeo, new THREE.MeshStandardMaterial());
  dialHubMesh.position.set(-0.35, 1.25, 0.38);
  dialHubMesh.rotation.x = Math.PI / 4;
  dialHubMesh.rotation.z = -Math.PI / 6;
  dialHubMesh.castShadow = true;
  parts['laces'].group.add(dialHubMesh);
  parts['laces'].meshes.push(dialHubMesh);

  const dialRingGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 24);
  const dialRingMesh = new THREE.Mesh(dialRingGeo, new THREE.MeshStandardMaterial());
  dialRingMesh.position.set(-0.35, 1.25, 0.42);
  dialRingMesh.rotation.x = Math.PI / 4;
  dialRingMesh.rotation.z = -Math.PI / 6;
  parts['laces'].group.add(dialRingMesh);
  parts['laces'].meshes.push(dialRingMesh);

  return { rootGroup, parts };
}
