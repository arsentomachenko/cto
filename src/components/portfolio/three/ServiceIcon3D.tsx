import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

export type Service3DKind =
  | 'diligence'
  | 'architecture'
  | 'acceleration'
  | 'bottleneck'
  | 'mentorship';

interface ServiceIcon3DProps {
  kind: Service3DKind;
}

const COLORS: Record<Service3DKind, string> = {
  diligence: '#3B82F6',
  architecture: '#14B8A6',
  acceleration: '#A855F7',
  bottleneck: '#F97316',
  mentorship: '#F59E0B',
};

const ServiceGlyph: React.FC<ServiceIcon3DProps> = ({ kind }) => {
  const groupRef = useRef<THREE.Group>(null);
  const accent = COLORS[kind];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.75;
    groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.25;
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {kind === 'diligence' && (
        <>
          <mesh>
            <icosahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.3} roughness={0.25} wireframe />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.05, 14, 80]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.28} metalness={0.4} roughness={0.35} />
          </mesh>
        </>
      )}

      {kind === 'architecture' && (
        <>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} metalness={0.45} roughness={0.35} />
          </mesh>
          <mesh position={[0.56, 0.15, -0.1]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.25} metalness={0.35} roughness={0.4} />
          </mesh>
          <mesh position={[-0.56, -0.15, 0.1]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.25} metalness={0.35} roughness={0.4} />
          </mesh>
        </>
      )}

      {kind === 'acceleration' && (
        <>
          <mesh>
            <sphereGeometry args={[0.36, 32, 32]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} metalness={0.2} roughness={0.3} />
          </mesh>
          <mesh rotation={[Math.PI / 2.7, Math.PI / 6, 0]}>
            <torusGeometry args={[0.62, 0.04, 12, 90]} />
            <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.28} metalness={0.35} roughness={0.4} />
          </mesh>
        </>
      )}

      {kind === 'bottleneck' && (
        <>
          <mesh position={[0, 0.1, 0]}>
            <coneGeometry args={[0.38, 0.7, 24, 1, true]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.25} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 0.22, 24]} />
            <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.3} metalness={0.35} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.57, 0]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#fdba74" emissive="#fdba74" emissiveIntensity={0.5} metalness={0.15} roughness={0.3} />
          </mesh>
        </>
      )}

      {kind === 'mentorship' && (
        <>
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.34, 0.43, 0.22, 26]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.2, 0.24, 0.52, 24]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} metalness={0.45} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.14, 22, 22]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.35} metalness={0.3} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[0.08, 0.2, 0.08]} />
            <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} metalness={0.35} roughness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
};

const ServiceIcon3D: React.FC<ServiceIcon3DProps> = ({ kind }) => {
  return (
    <div className="h-14 w-14 pointer-events-none">
      <ThreeErrorBoundary
        fallback={
          <div className="h-full w-full rounded-xl bg-white/30 dark:bg-white/10 border border-white/15" />
        }
      >
        <Canvas
          dpr={[1, 1.4]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 2.8], fov: 34 }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={1.8} color="#3B82F6" />
          <pointLight position={[-1.6, -1.2, 1.8]} intensity={1.3} color="#2DD4BF" />
          <ServiceGlyph kind={kind} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default ServiceIcon3D;
