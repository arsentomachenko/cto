import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

const FloatingKnot: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.55;
    meshRef.current.rotation.y = t * 0.85;
    meshRef.current.position.y = Math.sin(t * 1.4) * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.35, 0.12, 128, 18]} />
      <meshStandardMaterial
        color="#3B82F6"
        emissive="#2DD4BF"
        emissiveIntensity={0.32}
        metalness={0.55}
        roughness={0.22}
      />
    </mesh>
  );
};

const FooterGeoShape: React.FC = () => {
  return (
    <div className="w-9 h-9 pointer-events-none">
      <ThreeErrorBoundary
        fallback={<div className="w-9 h-9 rounded-full border border-blue-500/30" />}
      >
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 2.3], fov: 38 }}
          style={{ pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 1.8, 2]} intensity={2} color="#3B82F6" />
          <pointLight position={[-2, -1.2, 1.6]} intensity={1.2} color="#2DD4BF" />
          <FloatingKnot />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default FooterGeoShape;
