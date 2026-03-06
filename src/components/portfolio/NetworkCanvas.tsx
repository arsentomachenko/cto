import React, { useRef, useEffect, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  connections: number[];
  pulse: number;
  pulseSpeed: number;
}

interface NetworkCanvasProps {
  complexity?: number;
  className?: string;
}

const NetworkCanvas: React.FC<NetworkCanvasProps> = ({ complexity = 1, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const nodesRef = useRef<Node[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDarkRef = useRef(false);

  const createNodes = useCallback((width: number, height: number, comp: number) => {
    const nodeCount = Math.floor(40 + comp * 40);
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const baseRadius = 1.5 + Math.random() * 2.5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: baseRadius,
        baseRadius,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }
    // Pre-compute connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          nodes[i].connections.push(j);
        }
      }
    }
    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      nodesRef.current = createNodes(canvas.offsetWidth, canvas.offsetHeight, complexity);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains('dark');
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;
      const dark = isDarkRef.current;

      // Update nodes
      for (const node of nodes) {
        node.pulse += node.pulseSpeed;
        node.radius = node.baseRadius + Math.sin(node.pulse) * 0.8;

        // Mouse repulsion
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.5;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Damping
        node.vx *= 0.98;
        node.vy *= 0.98;

        node.x += node.vx;
        node.y += node.vy;

        // Bounds
        if (node.x < 0) { node.x = 0; node.vx *= -0.5; }
        if (node.x > w) { node.x = w; node.vx *= -0.5; }
        if (node.y < 0) { node.y = 0; node.vy *= -0.5; }
        if (node.y > h) { node.y = h; node.vy *= -0.5; }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const j of node.connections) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.3 * node.z;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            if (dark) {
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            } else {
              ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.6})`;
            }
            ctx.lineWidth = 0.5 + alpha;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glowAlpha = (Math.sin(node.pulse) + 1) / 2 * 0.4;
        // Glow
        if (dark) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 6);
          gradient.addColorStop(0, `rgba(59, 130, 246, ${glowAlpha * node.z})`);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 6, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * node.z, 0, Math.PI * 2);
        if (dark) {
          ctx.fillStyle = `rgba(59, 130, 246, ${0.6 + glowAlpha})`;
        } else {
          ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + glowAlpha * 0.5})`;
        }
        ctx.fill();
      }

      // Draw energy pulses along connections
      const time = Date.now() * 0.001;
      for (let i = 0; i < Math.min(nodes.length, 20); i++) {
        const node = nodes[i];
        if (node.connections.length === 0) continue;
        const j = node.connections[Math.floor(time * 0.5 + i) % node.connections.length];
        const other = nodes[j];
        const t = (Math.sin(time * 2 + i) + 1) / 2;
        const px = node.x + (other.x - node.x) * t;
        const py = node.y + (other.y - node.y) * t;
        
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        if (dark) {
          ctx.fillStyle = `rgba(45, 212, 191, ${0.6 * node.z})`;
        } else {
          ctx.fillStyle = `rgba(45, 212, 191, ${0.4 * node.z})`;
        }
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [complexity, createNodes]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

export default NetworkCanvas;
