import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, Float } from '@react-three/drei';
import * as THREE from 'three';
import ThreeErrorBoundary from './ThreeErrorBoundary';

interface HeroThreeBackgroundProps {
  complexity: number;
}

type PlanetSurface = 'rocky' | 'gas' | 'ice';

interface PlanetSpec {
  id: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  axialTilt?: number;
  surface: PlanetSurface;
  colors: [string, string, string?];
  ring?: boolean;
  moon?: {
    size: number;
    orbitRadius: number;
    orbitSpeed: number;
    color: string;
  };
}

interface PlanetTextures {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

const PLANETS: PlanetSpec[] = [
  {
    id: 'mercury',
    size: 0.16,
    orbitRadius: 2.2,
    orbitSpeed: 1.35,
    rotationSpeed: 0.7,
    surface: 'rocky',
    colors: ['#8f8f8f', '#606060', '#b9b9b9'],
  },
  {
    id: 'venus',
    size: 0.24,
    orbitRadius: 3.2,
    orbitSpeed: 1,
    rotationSpeed: 0.35,
    surface: 'gas',
    colors: ['#f4c98f', '#bd7d4c', '#edb674'],
  },
  {
    id: 'earth',
    size: 0.26,
    orbitRadius: 4.35,
    orbitSpeed: 0.84,
    rotationSpeed: 1.25,
    axialTilt: 0.32,
    surface: 'ice',
    colors: ['#2f74d0', '#2aa179', '#d5ecff'],
    moon: {
      size: 0.08,
      orbitRadius: 0.46,
      orbitSpeed: 2.4,
      color: '#c8ccd2',
    },
  },
  {
    id: 'mars',
    size: 0.2,
    orbitRadius: 5.5,
    orbitSpeed: 0.67,
    rotationSpeed: 1.05,
    surface: 'rocky',
    colors: ['#d46b3d', '#8f3d2a', '#ef9b6f'],
  },
  {
    id: 'jupiter',
    size: 0.66,
    orbitRadius: 7.7,
    orbitSpeed: 0.34,
    rotationSpeed: 1.6,
    surface: 'gas',
    colors: ['#e6bd96', '#a87355', '#f6d2b0'],
  },
  {
    id: 'saturn',
    size: 0.58,
    orbitRadius: 10.1,
    orbitSpeed: 0.26,
    rotationSpeed: 1.35,
    surface: 'gas',
    colors: ['#dfc67f', '#a88a4d', '#f3e0b0'],
    ring: true,
  },
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, rand: () => number) => void,
  seed: number,
  color: boolean = true
) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to get canvas context for texture generation');
  }

  draw(ctx, mulberry32(seed));
  const texture = new THREE.CanvasTexture(canvas);
  if (color) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function buildPlanetTextures(spec: PlanetSpec): PlanetTextures {
  const width = 512;
  const height = 256;
  const seedBase = hashString(spec.id);

  const map = makeCanvasTexture(
    width,
    height,
    (ctx, rand) => {
      const [a, b, c] = spec.colors;
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, a);
      bg.addColorStop(0.5, b);
      bg.addColorStop(1, c || a);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (spec.surface === 'gas') {
        for (let i = 0; i < 50; i += 1) {
          const y = rand() * height;
          const bandHeight = 4 + rand() * 14;
          const opacity = 0.06 + rand() * 0.18;
          ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
          ctx.fillRect(0, y, width, bandHeight);
        }

        for (let i = 0; i < 25; i += 1) {
          const y = rand() * height;
          const w = width * (0.2 + rand() * 0.35);
          const h = height * (0.02 + rand() * 0.08);
          ctx.fillStyle = `rgba(255,255,255,${(0.05 + rand() * 0.1).toFixed(3)})`;
          ctx.beginPath();
          ctx.ellipse(rand() * width, y, w, h, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (spec.surface === 'rocky' || spec.surface === 'ice') {
        for (let i = 0; i < 900; i += 1) {
          const x = rand() * width;
          const y = rand() * height;
          const alpha = spec.surface === 'ice' ? 0.18 : 0.12;
          ctx.fillStyle = `rgba(255,255,255,${(alpha * rand()).toFixed(3)})`;
          const radius = rand() * 2.2;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = 0; i < 70; i += 1) {
          const x = rand() * width;
          const y = rand() * height;
          const radius = 2 + rand() * 12;
          ctx.strokeStyle = `rgba(0,0,0,${(0.04 + rand() * 0.12).toFixed(3)})`;
          ctx.lineWidth = 1 + rand() * 1.5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    },
    seedBase + 101,
    true
  );

  const bumpMap = makeCanvasTexture(
    width,
    height,
    (ctx, rand) => {
      const img = ctx.createImageData(width, height);
      const data = img.data;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const i = (y * width + x) * 4;
          const horiz = Math.sin((x / width) * Math.PI * (spec.surface === 'gas' ? 28 : 12));
          const noise = rand() * 0.55;
          const value = Math.floor((0.45 + horiz * 0.2 + noise * 0.35) * 255);
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
    },
    seedBase + 202,
    false
  );

  const roughnessMap = makeCanvasTexture(
    width,
    height,
    (ctx, rand) => {
      const img = ctx.createImageData(width, height);
      const data = img.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor((0.55 + rand() * 0.45) * 255);
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }

      ctx.putImageData(img, 0, 0);
    },
    seedBase + 303,
    false
  );

  return { map, bumpMap, roughnessMap };
}

function buildRingTexture(seed: number) {
  return makeCanvasTexture(
    1024,
    128,
    (ctx, rand) => {
      ctx.clearRect(0, 0, 1024, 128);

      for (let x = 0; x < 1024; x += 1) {
        const norm = x / 1024;
        const fade = Math.sin(norm * Math.PI);
        const alpha = Math.max(0.02, fade * (0.35 + rand() * 0.45));
        const tone = 180 + Math.floor(rand() * 60);
        ctx.fillStyle = `rgba(${tone}, ${tone}, ${Math.min(255, tone + 20)}, ${alpha.toFixed(3)})`;
        ctx.fillRect(x, 0, 1, 128);
      }

      for (let i = 0; i < 120; i += 1) {
        const x = rand() * 1024;
        const w = 2 + rand() * 6;
        ctx.fillStyle = `rgba(255,255,255,${(0.03 + rand() * 0.08).toFixed(3)})`;
        ctx.fillRect(x, 0, w, 128);
      }
    },
    seed,
    true
  );
}

const OrbitPath: React.FC<{ radius: number }> = ({ radius }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.012, radius + 0.012, 192]} />
      <meshBasicMaterial color="#5ea7ff" transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  );
};

const OrbitingPlanet: React.FC<{
  spec: PlanetSpec;
  speedMultiplier: number;
  phaseOffset: number;
}> = ({ spec, speedMultiplier, phaseOffset }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const angleRef = useRef(phaseOffset);
  const moonAngleRef = useRef(phaseOffset * 2.5);

  const textures = useMemo(() => buildPlanetTextures(spec), [spec]);
  const ringTexture = useMemo(
    () => (spec.ring ? buildRingTexture(hashString(`${spec.id}-ring`)) : null),
    [spec.id, spec.ring]
  );

  useEffect(() => {
    return () => {
      textures.map.dispose();
      textures.bumpMap.dispose();
      textures.roughnessMap.dispose();
      ringTexture?.dispose();
    };
  }, [textures, ringTexture]);

  useFrame((_, delta) => {
    angleRef.current += delta * spec.orbitSpeed * speedMultiplier;

    if (orbitRef.current) {
      orbitRef.current.position.set(
        Math.cos(angleRef.current) * spec.orbitRadius,
        Math.sin(angleRef.current * 0.7 + phaseOffset) * 0.08,
        Math.sin(angleRef.current) * spec.orbitRadius
      );
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * spec.rotationSpeed;
      planetRef.current.rotation.z = spec.axialTilt || 0;
    }

    if (spec.moon && moonOrbitRef.current) {
      moonAngleRef.current += delta * spec.moon.orbitSpeed * speedMultiplier;
      moonOrbitRef.current.position.set(
        Math.cos(moonAngleRef.current) * spec.moon.orbitRadius,
        Math.sin(moonAngleRef.current * 1.2) * 0.03,
        Math.sin(moonAngleRef.current) * spec.moon.orbitRadius
      );
    }
  });

  return (
    <>
      <OrbitPath radius={spec.orbitRadius} />

      <group ref={orbitRef}>
        <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.14}>
          <mesh ref={planetRef}>
            <sphereGeometry args={[spec.size, 64, 64]} />
            <meshStandardMaterial
              map={textures.map}
              bumpMap={textures.bumpMap}
              bumpScale={spec.surface === 'gas' ? 0.02 : 0.06}
              roughnessMap={textures.roughnessMap}
              roughness={spec.surface === 'gas' ? 0.75 : 0.88}
              metalness={0.03}
            />
          </mesh>

          {spec.ring && ringTexture && (
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <ringGeometry args={[spec.size * 1.5, spec.size * 2.5, 160]} />
              <meshStandardMaterial
                map={ringTexture}
                color="#c7b188"
                emissive="#8d7f66"
                emissiveIntensity={0.08}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                roughness={0.9}
                metalness={0.05}
                alphaTest={0.07}
              />
            </mesh>
          )}

          {spec.moon && (
            <>
              <group ref={moonOrbitRef}>
                <mesh>
                  <sphereGeometry args={[spec.moon.size, 30, 30]} />
                  <meshStandardMaterial color={spec.moon.color} roughness={0.9} metalness={0.02} />
                </mesh>
              </group>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry
                  args={[
                    spec.moon.orbitRadius - 0.002,
                    spec.moon.orbitRadius + 0.002,
                    96,
                  ]}
                />
                <meshBasicMaterial color="#9fb7da" transparent opacity={0.2} side={THREE.DoubleSide} />
              </mesh>
            </>
          )}
        </Float>
      </group>
    </>
  );
};

const Starfield: React.FC<{ count: number; radius: number; color: string; size: number }> = ({
  count,
  radius,
  color,
  size,
}) => {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const rand = mulberry32(hashString(`${count}-${radius}-${color}-${size}`));

    for (let i = 0; i < count; i += 1) {
      const u = rand();
      const v = rand();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.65 + rand() * 0.35);

      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }

    return arr;
  }, [count, radius, color, size]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
    </points>
  );
};

const AsteroidBelt: React.FC<{ density: number }> = ({ density }) => {
  const positions = useMemo(() => {
    const count = Math.floor(220 + density * 140);
    const arr = new Float32Array(count * 3);
    const rand = mulberry32(hashString(`asteroids-${density}`));

    for (let i = 0; i < count; i += 1) {
      const angle = rand() * Math.PI * 2;
      const r = 6.35 + (rand() - 0.5) * 0.95;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (rand() - 0.5) * 0.25;
      arr[i * 3 + 2] = Math.sin(angle) * r;
    }

    return arr;
  }, [density]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ba9f7a" size={0.017} sizeAttenuation opacity={0.85} transparent />
    </points>
  );
};

const SolarSystem: React.FC<{ complexity: number }> = ({ complexity }) => {
  const rootRef = useRef<THREE.Group>(null);
  const normalizedComplexity = THREE.MathUtils.clamp((complexity - 1) / 3, 0, 1);
  const speedMultiplier = 0.45 + normalizedComplexity * 0.9;

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (rootRef.current) {
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        state.pointer.x * 0.22 + elapsed * 0.015,
        0.03
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        -0.06 + state.pointer.y * 0.08,
        0.03
      );
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 1.15, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.4 + state.pointer.y * 0.55, 0.035);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={rootRef}>
      <Starfield count={700} radius={45} color="#9ec7ff" size={0.06} />
      <Starfield count={350} radius={35} color="#d7efff" size={0.045} />

      <mesh>
        <sphereGeometry args={[1.05, 96, 96]} />
        <meshStandardMaterial
          color="#ffbb44"
          emissive="#ff6e1c"
          emissiveIntensity={2.1}
          roughness={0.72}
          metalness={0.02}
        />
      </mesh>

      <mesh scale={1.18}>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#ffb155" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      <pointLight color="#ffbe55" intensity={12 + normalizedComplexity * 5} distance={48} decay={2} />

      <AsteroidBelt density={normalizedComplexity} />

      {PLANETS.map((planet, index) => (
        <OrbitingPlanet
          key={planet.id}
          spec={planet}
          speedMultiplier={speedMultiplier}
          phaseOffset={index * 0.72 + 0.5}
        />
      ))}
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
          camera={{ position: [0, 1.4, 14.2], fov: 38 }}
          style={{ pointerEvents: 'none' }}
        >
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.16} color="#7aa7dd" />
          <hemisphereLight color="#9fc7ff" groundColor="#09121f" intensity={0.33} />
          <directionalLight position={[-8, 3, 4]} color="#7ca4d9" intensity={0.26} />
          <SolarSystem complexity={complexity} />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

export default HeroThreeBackground;
