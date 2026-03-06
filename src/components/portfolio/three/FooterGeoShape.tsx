import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

const FloatingShape: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.rotation.x = t * 0.55;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.45} floatIntensity={0.35}>
        <mesh>
          <icosahedronGeometry args={[0.35, 2]} />
          <meshPhysicalMaterial
            color="#3B82F6"
            emissive="#2DD4BF"
            emissiveIntensity={0.38}
            metalness={0.62}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.22}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[0.55, 0.06, 16, 96]} />
          <meshStandardMaterial color="#2DD4BF" emissive="#2DD4BF" emissiveIntensity={0.22} metalness={0.48} roughness={0.3} />
        </mesh>
      </Float>
      <Sparkles count={10} scale={1.5} size={1.8} speed={0.4} color="#93c5fd" />
    </group>
  );
};

const FooterGeoShape: React.FC = () => {
  return (
    <div className="w-9 h-9 pointer-events-none">
      <ThreeErrorBoundary
        fallback={<div className="w-9 h-9 rounded-full border border-blue-500/30" />}
      >
        <Canvas
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 2.5], fov: 40 }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 1.8, 2]} intensity={2} color="#3B82F6" />
          <pointLight position={[-2, -1.2, 1.6]} intensity={1.3} color="#2DD4BF" />
          <FloatingShape />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default FooterGeoShape;
