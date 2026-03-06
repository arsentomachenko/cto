import { useEffect, useState } from 'react';
import * as THREE from 'three';

let cachedSupport: boolean | null = null;

const softwareRendererPattern =
  /swiftshader|llvmpipe|software|vmware|svga3d|microsoft basic render|mesa offscreen/i;

function getRendererInfo(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  let vendor = '';
  let renderer = '';

  try {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      vendor = (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '').toString();
      renderer = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toString();
    }
  } catch {
    // no-op: extension access is optional and can fail on locked-down contexts
  }

  if (!renderer) {
    try {
      renderer = (gl.getParameter(gl.RENDERER) || '').toString();
    } catch {
      renderer = '';
    }
  }

  if (!vendor) {
    try {
      vendor = (gl.getParameter(gl.VENDOR) || '').toString();
    } catch {
      vendor = '';
    }
  }

  return `${vendor} ${renderer}`.trim();
}

function canCreateThreeRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  const canvas = gl.canvas as HTMLCanvasElement;

  let geometry: THREE.SphereGeometry | null = null;
  let material: THREE.MeshBasicMaterial | null = null;
  let renderer: THREE.WebGLRenderer | null = null;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(1, 1, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    camera.position.z = 2;

    geometry = new THREE.SphereGeometry(0.2, 8, 8);
    material = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.render(scene, camera);

    return true;
  } catch {
    return false;
  } finally {
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
  }
}

function detectWebGLSupport() {
  if (cachedSupport !== null) {
    return cachedSupport;
  }

  if (typeof window === 'undefined') {
    cachedSupport = false;
    return cachedSupport;
  }

  try {
    const canvas = document.createElement('canvas');

    const contextAttributes = {
      failIfMajorPerformanceCaveat: true,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance' as WebGLPowerPreference,
      preserveDrawingBuffer: false,
      stencil: false,
      depth: true,
    };

    const gl =
      canvas.getContext('webgl2', contextAttributes) ||
      canvas.getContext('webgl', contextAttributes) ||
      canvas.getContext('experimental-webgl', contextAttributes);

    if (!gl) {
      cachedSupport = false;
      return cachedSupport;
    }

    const rendererInfo = getRendererInfo(gl);
    if (softwareRendererPattern.test(rendererInfo)) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
      cachedSupport = false;
      return cachedSupport;
    }

    if (!canCreateThreeRenderer(gl)) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
      cachedSupport = false;
      return cachedSupport;
    }

    const loseContext = gl.getExtension('WEBGL_lose_context');
    loseContext?.loseContext();

    cachedSupport = true;
    return cachedSupport;
  } catch {
    cachedSupport = false;
    return cachedSupport;
  }
}

export function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(detectWebGLSupport());
  }, []);

  return isSupported;
}
