import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

interface HeroThreeBackgroundProps {
  complexity: number;
}

const MAX_NODE_COUNT = 180;
const MAX_LINE_COUNT = 520;

const HeroNetwork: React.FC<{ complexity: number }> = ({ complexity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const nodes = useMemo(() => {
    const seededNodes: THREE.Vector3[] = [];
    for (let i = 0; i < MAX_NODE_COUNT; i += 1) {
      const spread = 2.8 + (i % 3) * 0.4;
      seededNodes.push(
        new THREE.Vector3(
          (Math.random() * 2 - 1) * spread,
          (Math.random() * 2 - 1) * spread,
          (Math.random() * 2 - 1) * 1.6
        )
      );
    }
    return seededNodes;
  }, []);

  const activeNodeCount = useMemo(
    () => Math.min(nodes.length, Math.floor(46 + complexity * 30)),
    [nodes.length, complexity]
  );

  const activePairs = useMemo(() => {
    const pairs: Array<[number, number]> = [];
    const threshold = 1.9 + complexity * 0.15;

    for (let i = 0; i < activeNodeCount; i += 1) {
      for (let j = i + 1; j < activeNodeCount; j += 1) {
        if (pairs.length >= MAX_LINE_COUNT) {
          return pairs;
        }

        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          pairs.push([i, j]);
        }
      }
    }

    return pairs;
  }, [activeNodeCount, complexity, nodes]);

  const pointPositions = useMemo(() => {
    const positions = new Float32Array(activeNodeCount * 3);
    for (let i = 0; i < activeNodeCount; i += 1) {
      positions[i * 3] = nodes[i].x;
      positions[i * 3 + 1] = nodes[i].y;
      positions[i * 3 + 2] = nodes[i].z;
    }
    return positions;
  }, [activeNodeCount, nodes]);

  const linePositions = useMemo(() => {
    const positions = new Float32Array(activePairs.length * 6);
    activePairs.forEach(([a, b], index) => {
      const offset = index * 6;
      positions[offset] = nodes[a].x;
      positions[offset + 1] = nodes[a].y;
      positions[offset + 2] = nodes[a].z;
      positions[offset + 3] = nodes[b].x;
      positions[offset + 4] = nodes[b].y;
      positions[offset + 5] = nodes[b].z;
    });
    return positions;
  }, [activePairs, nodes]);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.22 + elapsed * 0.02,
        0.035
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.16,
        0.035
      );
    }

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.45,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.35,
      0.04
    );
    state.camera.lookAt(0, 0, 0);

    if (pointsRef.current) {
      pointsRef.current.rotation.y = elapsed * 0.04;
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = -elapsed * 0.015;
      const material = linesRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.2 + complexity * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={pointPositions}
            count={pointPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#3B82F6"
          size={0.045 + complexity * 0.01}
          sizeAttenuation
          transparent
          opacity={0.92}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2DD4BF" transparent opacity={0.28} />
      </lineSegments>

      <mesh position={[0, 0, -1.9]} rotation={[Math.PI * 0.3, Math.PI * 0.15, 0]}>
        <torusGeometry args={[1.3, 0.03, 16, 140]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const HeroThreeBackground: React.FC<HeroThreeBackgroundProps> = ({ complexity }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <ThreeErrorBoundary
        fallback={<div className="absolute inset-0 bg-slate-100/30 dark:bg-[#0A1929]/30" />}
      >
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 5.3], fov: 42 }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[4, 3, 4]} color="#3B82F6" intensity={2.4} />
          <pointLight position={[-3, -2, 3]} color="#2DD4BF" intensity={1.6} />
          <HeroNetwork complexity={complexity} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default HeroThreeBackground;
