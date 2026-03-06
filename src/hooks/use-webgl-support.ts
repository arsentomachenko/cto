import { useEffect, useState } from 'react';

let cachedSupport: boolean | null = null;

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

    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('experimental-webgl');

    if (!gl) {
      cachedSupport = false;
      return cachedSupport;
    }

    const rendererInfo = (gl.getParameter(gl.RENDERER) || '').toString();
    const softwareRendererPattern = /swiftshader|llvmpipe|software|vmware/i;
    if (softwareRendererPattern.test(rendererInfo)) {
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
