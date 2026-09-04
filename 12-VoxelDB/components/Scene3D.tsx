'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useVoxelDBStore } from '../store/useVoxelDBStore';
import { VectorEmbedding } from '../types/vector';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function Scene3D() {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const probeRingRef = useRef<THREE.Mesh | null>(null);
  const probeCoreRef = useRef<THREE.Mesh | null>(null);
  const lineSegmentsRef = useRef<THREE.LineSegments | null>(null);

  const vectors = useVoxelDBStore((state) => state.vectors);
  const selectedVectorId = useVoxelDBStore((state) => state.selectedVectorId);
  const activeProbe = useVoxelDBStore((state) => state.activeProbe);
  const activeMetric = useVoxelDBStore((state) => state.activeMetric);
  const activeClusters = useVoxelDBStore((state) => state.activeClusters);
  const activeHNSWLayerFilter = useVoxelDBStore((state) => state.activeHNSWLayerFilter);
  const isAutoRotate = useVoxelDBStore((state) => state.isAutoRotate);
  const selectVector = useVoxelDBStore((state) => state.selectVector);
  const setHoveredVector = useVoxelDBStore((state) => state.setHoveredVector);

  const selectedVector = useMemo(
    () => vectors.find((v) => v.id === selectedVectorId),
    [vectors, selectedVectorId]
  );

  const neighborIds = useMemo(() => {
    if (!activeProbe) return new Set<string>();
    return new Set(activeProbe.neighbors.map((n) => n.id));
  }, [activeProbe]);

  // Color mapping based on active metric for nearest neighbor links
  const metricColorHex = useMemo(() => {
    switch (activeMetric) {
      case 'cosine':
        return '#06B6D4'; // Neon Cyan
      case 'euclidean':
        return '#D946EF'; // Neon Magenta
      case 'manhattan':
        return '#EAB308'; // Amber Gold
    }
  }, [activeMetric]);

  // Update InstancedMesh matrices and colors
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    vectors.forEach((v, i) => {
      const isVisible =
        activeClusters[v.category] &&
        (activeHNSWLayerFilter === 'all' || v.hnswLayer >= activeHNSWLayerFilter);

      const isSelected = v.id === selectedVectorId;
      const isNeighbor = neighborIds.has(v.id);

      if (!isVisible) {
        tempObject.position.set(0, -9999, 0);
        tempObject.scale.set(0, 0, 0);
      } else {
        tempObject.position.set(...v.position);

        if (isSelected) {
          tempObject.scale.set(2.4, 2.4, 2.4);
        } else if (isNeighbor) {
          tempObject.scale.set(1.7, 1.7, 1.7);
        } else {
          // Standard scale slightly larger for higher HNSW layers
          const baseScale = 0.85 + v.hnswLayer * 0.25;
          tempObject.scale.set(baseScale, baseScale, baseScale);
        }
      }

      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      // Color assignment
      if (isSelected) {
        tempColor.set('#FFFFFF');
      } else if (isNeighbor) {
        tempColor.set(metricColorHex);
      } else {
        tempColor.set(v.clusterColor);
      }

      mesh.setColorAt(i, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [
    vectors,
    selectedVectorId,
    neighborIds,
    activeClusters,
    activeHNSWLayerFilter,
    metricColorHex,
  ]);

  // Build laser lines geometry connecting query probe to Top-K neighbors
  const lineGeometry = useMemo(() => {
    if (!selectedVector || !activeProbe || activeProbe.neighbors.length === 0) {
      return new THREE.BufferGeometry();
    }

    const points: number[] = [];
    const [sx, sy, sz] = selectedVector.position;

    activeProbe.neighbors.forEach((neighbor) => {
      const [nx, ny, nz] = neighbor.targetVector.position;
      points.push(sx, sy, sz);
      points.push(nx, ny, nz);
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, [selectedVector, activeProbe]);

  // Animate probe pulsing ring and core
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (probeRingRef.current && selectedVector) {
      const ringScale = 1.0 + Math.sin(time * 4) * 0.45;
      probeRingRef.current.scale.set(ringScale, ringScale, ringScale);
      probeRingRef.current.rotation.z += 0.02;
      probeRingRef.current.rotation.x += 0.01;
    }

    if (probeCoreRef.current && selectedVector) {
      const coreScale = 1.0 + Math.cos(time * 5) * 0.2;
      probeCoreRef.current.scale.set(coreScale, coreScale, coreScale);
    }
  });

  return (
    <>
      {/* Dark Ambient & Directional Lighting */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[20, 40, 20]} intensity={1.2} />
      <pointLight position={[-20, -20, -20]} intensity={0.6} color="#1E1B4B" />

      {/* OrbitControls with smooth damping & inertia */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.8}
        zoomSpeed={1.0}
        panSpeed={0.8}
        maxDistance={140}
        minDistance={6}
        autoRotate={isAutoRotate}
        autoRotateSpeed={0.6}
      />

      {/* Thin Coordinate Grid Overlay Planes (#1E1B4B) */}
      <gridHelper
        args={[100, 50, '#312E81', '#1E1B4B']}
        position={[0, -26, 0]}
      />
      <gridHelper
        args={[100, 50, '#1E1B4B', '#0F172A']}
        position={[0, 26, 0]}
      />

      {/* 1,500+ Instanced Vectors Mesh */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, vectors.length]}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) {
            const hitVector = vectors[e.instanceId];
            if (hitVector) {
              selectVector(hitVector.id);
            }
          }
        }}
        onPointerOver={(e) => {
          if (e.instanceId !== undefined) {
            const hitVector = vectors[e.instanceId];
            if (hitVector) {
              setHoveredVector(hitVector.id);
              document.body.style.cursor = 'pointer';
            }
          }
        }}
        onPointerOut={() => {
          setHoveredVector(null);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          emissiveIntensity={0.6}
        />
      </instancedMesh>

      {/* Pulsing Query Probe on Selected Node */}
      {selectedVector && (
        <group position={selectedVector.position}>
          {/* Inner Glowing Core */}
          <mesh ref={probeCoreRef}>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive={metricColorHex}
              emissiveIntensity={2.5}
              roughness={0.1}
            />
          </mesh>

          {/* Outer Pulsing Aura Ring */}
          <mesh ref={probeRingRef}>
            <ringGeometry args={[1.2, 1.45, 32]} />
            <meshBasicMaterial
              color={metricColorHex}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}

      {/* Animated Glowing Laser Lines to Top-K Nearest Neighbors */}
      {selectedVector && activeProbe && (
        <lineSegments ref={lineSegmentsRef} geometry={lineGeometry}>
          <lineBasicMaterial
            color={metricColorHex}
            linewidth={2}
            transparent
            opacity={0.85}
          />
        </lineSegments>
      )}
    </>
  );
}
