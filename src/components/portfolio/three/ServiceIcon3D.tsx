import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
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

  const glowColor = useMemo(() => {
    const mixed = new THREE.Color(accent).lerp(new THREE.Color('#2DD4BF'), 0.3);
    return mixed.getStyle();
  }, [accent]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.rotation.x = Math.sin(t * 1.1) * 0.28;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.5}>
        {kind === 'diligence' && (
          <>
            <mesh>
              <icosahedronGeometry args={[0.37, 1]} />
              <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.65} roughness={0.2} clearcoat={1} clearcoatRoughness={0.18} wireframe />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.58, 0.05, 14, 90]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.22} metalness={0.4} roughness={0.35} />
            </mesh>
          </>
        )}

        {kind === 'architecture' && (
          <>
            <mesh>
              <octahedronGeometry args={[0.36, 0]} />
              <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.28} metalness={0.55} roughness={0.25} clearcoat={0.85} />
            </mesh>
            <mesh position={[0.52, 0.13, -0.06]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.22} metalness={0.4} roughness={0.32} />
            </mesh>
            <mesh position={[-0.52, -0.13, 0.08]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.2} metalness={0.4} roughness={0.32} />
            </mesh>
          </>
        )}

        {kind === 'acceleration' && (
          <>
            <mesh>
              <sphereGeometry args={[0.32, 30, 30]} />
              <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.35} metalness={0.4} roughness={0.16} transmission={0.15} thickness={0.8} clearcoat={1} />
            </mesh>
            <mesh rotation={[Math.PI / 2.7, Math.PI / 5, 0]}>
              <torusGeometry args={[0.58, 0.04, 14, 90]} />
              <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.26} metalness={0.45} roughness={0.3} />
            </mesh>
          </>
        )}

        {kind === 'bottleneck' && (
          <>
            <mesh position={[0, 0.08, 0]}>
              <coneGeometry args={[0.34, 0.66, 24, 1, true]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.3} metalness={0.28} roughness={0.34} />
            </mesh>
            <mesh position={[0, -0.36, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.2, 24]} />
              <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.25} metalness={0.36} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.54, 0]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#fdba74" emissive="#fdba74" emissiveIntensity={0.5} metalness={0.12} roughness={0.25} />
            </mesh>
          </>
        )}

        {kind === 'mentorship' && (
          <>
            <mesh position={[0, -0.26, 0]}>
              <cylinderGeometry args={[0.31, 0.38, 0.2, 26]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.2} metalness={0.44} roughness={0.36} />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.18, 0.21, 0.5, 24]} />
              <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.22} metalness={0.52} roughness={0.28} clearcoat={0.95} />
            </mesh>
            <mesh position={[0, 0.43, 0]}>
              <sphereGeometry args={[0.13, 22, 22]} />
              <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.36} metalness={0.34} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
              <boxGeometry args={[0.08, 0.18, 0.08]} />
              <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.4} metalness={0.34} roughness={0.25} />
            </mesh>
          </>
        )}
      </Float>

      <Sparkles count={8} scale={1.3} size={2} speed={0.4} color={glowColor} />
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
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 2.8], fov: 34 }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 2, 2]} intensity={1.9} color="#3B82F6" />
          <pointLight position={[-1.8, -1.2, 1.8]} intensity={1.4} color="#2DD4BF" />
          <ServiceGlyph kind={kind} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default ServiceIcon3D;
