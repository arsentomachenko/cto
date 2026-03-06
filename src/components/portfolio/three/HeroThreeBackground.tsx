import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, Float } from '@react-three/drei';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

interface HeroThreeBackgroundProps {
  complexity: number;
}

interface NodeState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
}

const NODE_CAP = 140;
const LINE_CAP = 420;

const NetworkField: React.FC<{ complexity: number }> = ({ complexity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsAttributeRef = useRef<THREE.BufferAttribute>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesAttributeRef = useRef<THREE.BufferAttribute>(null);

  const nodes = useMemo<NodeState[]>(() => {
    const initial: NodeState[] = [];
    for (let i = 0; i < NODE_CAP; i += 1) {
      const radius = 0.6 + Math.random() * 2.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.78,
        radius * Math.cos(phi) * 0.45
      );
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.004
      );
      initial.push({
        position,
        velocity,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return initial;
  }, []);

  const pointPositions = useMemo(() => {
    const arr = new Float32Array(NODE_CAP * 3);
    for (let i = 0; i < NODE_CAP; i += 1) {
      arr[i * 3] = nodes[i].position.x;
      arr[i * 3 + 1] = nodes[i].position.y;
      arr[i * 3 + 2] = nodes[i].position.z;
    }
    return arr;
  }, [nodes]);

  const linePositions = useMemo(() => new Float32Array(LINE_CAP * 6), []);

  const bounds = useMemo(() => new THREE.Vector3(3.4, 2.2, 1.5), []);
  const centerPull = useMemo(() => new THREE.Vector3(), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    const activeCount = Math.min(NODE_CAP, Math.floor(38 + complexity * 26));
    const threshold = 1.05 + complexity * 0.28;
    const thresholdSq = threshold * threshold;
    const pointerInfluence = 0.55 + complexity * 0.15;

    const pointerX = state.pointer.x * 1.7;
    const pointerY = state.pointer.y * 1.1;

    for (let i = 0; i < activeCount; i += 1) {
      const node = nodes[i];

      node.velocity.x += (pointerX - node.position.x) * 0.00045 * pointerInfluence;
      node.velocity.y += (pointerY - node.position.y) * 0.00033 * pointerInfluence;
      node.velocity.z += Math.sin(elapsed * 0.6 + node.phase) * 0.00008;

      centerPull.copy(node.position).multiplyScalar(-0.00075);
      node.velocity.add(centerPull);
      node.velocity.multiplyScalar(0.986);
      node.velocity.clampLength(0.0004, 0.03);
      node.position.addScaledVector(node.velocity, delta * 60);

      node.position.x += Math.sin(elapsed * 0.28 + node.phase) * 0.0017;
      node.position.y += Math.cos(elapsed * 0.34 + node.phase * 1.3) * 0.0015;

      if (Math.abs(node.position.x) > bounds.x) node.velocity.x *= -0.95;
      if (Math.abs(node.position.y) > bounds.y) node.velocity.y *= -0.95;
      if (Math.abs(node.position.z) > bounds.z) node.velocity.z *= -0.95;

      node.position.x = THREE.MathUtils.clamp(node.position.x, -bounds.x, bounds.x);
      node.position.y = THREE.MathUtils.clamp(node.position.y, -bounds.y, bounds.y);
      node.position.z = THREE.MathUtils.clamp(node.position.z, -bounds.z, bounds.z);

      pointPositions[i * 3] = node.position.x;
      pointPositions[i * 3 + 1] = node.position.y;
      pointPositions[i * 3 + 2] = node.position.z;
    }

    if (pointsAttributeRef.current) {
      pointsAttributeRef.current.needsUpdate = true;
    }

    let lineCount = 0;
    for (let i = 0; i < activeCount && lineCount < LINE_CAP; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < activeCount && lineCount < LINE_CAP; j += 1) {
        const b = nodes[j];
        const distSq = a.position.distanceToSquared(b.position);

        if (distSq < thresholdSq) {
          const offset = lineCount * 6;
          linePositions[offset] = a.position.x;
          linePositions[offset + 1] = a.position.y;
          linePositions[offset + 2] = a.position.z;
          linePositions[offset + 3] = b.position.x;
          linePositions[offset + 4] = b.position.y;
          linePositions[offset + 5] = b.position.z;
          lineCount += 1;
        }
      }
    }

    if (linesGeometryRef.current) {
      linesGeometryRef.current.setDrawRange(0, lineCount * 2);
    }

    if (linesAttributeRef.current) {
      linesAttributeRef.current.needsUpdate = true;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.22 + elapsed * 0.025,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.13,
        0.03
      );
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.45, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.3, 0.04);
    state.camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      scratch.set(0, 0, -1.8);
      scratch.applyEuler(groupRef.current.rotation);
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={pointsAttributeRef}
            attach="attributes-position"
            array={pointPositions}
            count={pointPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8cc8ff"
          size={0.04 + complexity * 0.008}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute
            ref={linesAttributeRef}
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#2DD4BF" transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.35}>
        <mesh position={[1.95, 0.75, -0.85]}>
          <icosahedronGeometry args={[0.26, 1]} />
          <meshPhysicalMaterial
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={0.35}
            metalness={0.55}
            roughness={0.25}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.18} floatIntensity={0.28}>
        <mesh position={[-2.05, -0.55, -1.1]} rotation={[0.5, 0, 0.35]}>
          <torusGeometry args={[0.36, 0.07, 18, 70]} />
          <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.22} metalness={0.48} roughness={0.3} />
        </mesh>
      </Float>

      <mesh position={[0, 0, -2.1]} rotation={[Math.PI * 0.3, Math.PI * 0.15, 0]}>
        <torusGeometry args={[1.48, 0.018, 16, 160]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.24} blending={THREE.AdditiveBlending} />
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
          dpr={[1, 1.8]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 4.9], fov: 40 }}
          style={{ pointerEvents: 'none' }}
        >
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.25} />
          <hemisphereLight color="#9ad0ff" groundColor="#0f172a" intensity={0.4} />
          <pointLight position={[3.8, 2.8, 4.2]} color="#3B82F6" intensity={2.2} />
          <pointLight position={[-3, -2, 2.8]} color="#2DD4BF" intensity={1.5} />
          <NetworkField complexity={complexity} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default HeroThreeBackground;
