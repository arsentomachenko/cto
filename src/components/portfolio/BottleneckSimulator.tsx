import React, { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface ArchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  threshold: number;
  criticalThreshold: number;
  tooltip: string;
}

const nodes: ArchNode[] = [
  { id: 'cdn', label: 'CDN', x: 50, y: 15, threshold: 500000, criticalThreshold: 900000, tooltip: 'CDN cache miss rate increasing' },
  { id: 'lb', label: 'Load Balancer', x: 50, y: 30, threshold: 300000, criticalThreshold: 700000, tooltip: 'Connection limit approaching' },
  { id: 'api1', label: 'API Server 1', x: 25, y: 50, threshold: 100000, criticalThreshold: 400000, tooltip: 'CPU at 90%+ utilization' },
  { id: 'api2', label: 'API Server 2', x: 75, y: 50, threshold: 200000, criticalThreshold: 500000, tooltip: 'Memory pressure detected' },
  { id: 'cache', label: 'Redis Cache', x: 25, y: 70, threshold: 250000, criticalThreshold: 600000, tooltip: 'Cache eviction rate spiking' },
  { id: 'db', label: 'Database', x: 75, y: 70, threshold: 50000, criticalThreshold: 200000, tooltip: 'Connection pool exhausted' },
  { id: 'queue', label: 'Message Queue', x: 50, y: 85, threshold: 150000, criticalThreshold: 400000, tooltip: 'Queue depth growing rapidly' },
];

const connections: [string, string][] = [
  ['cdn', 'lb'],
  ['lb', 'api1'],
  ['lb', 'api2'],
  ['api1', 'cache'],
  ['api1', 'db'],
  ['api2', 'cache'],
  ['api2', 'db'],
  ['api1', 'queue'],
  ['api2', 'queue'],
];

const BottleneckSimulator: React.FC = () => {
  const [users, setUsers] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const getNodeStatus = (node: ArchNode) => {
    if (users >= node.criticalThreshold) return 'critical';
    if (users >= node.threshold) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return { fill: '#EF4444', stroke: '#EF4444', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'warning': return { fill: '#F59E0B', stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' };
      default: return { fill: '#10B981', stroke: '#10B981', glow: 'rgba(16, 185, 129, 0.2)' };
    }
  };

  const getConnectionColor = (from: string, to: string) => {
    const fromNode = nodes.find(n => n.id === from)!;
    const toNode = nodes.find(n => n.id === to)!;
    const fromStatus = getNodeStatus(fromNode);
    const toStatus = getNodeStatus(toNode);
    if (fromStatus === 'critical' || toStatus === 'critical') return '#EF4444';
    if (fromStatus === 'warning' || toStatus === 'warning') return '#F59E0B';
    return '#10B981';
  };

  const getConnectionWidth = () => {
    return 1 + (users / 1000000) * 3;
  };

  const formatUsers = (val: number) => {
    if (val >= 1000000) return '1M';
    if (val >= 1000) return `${Math.round(val / 1000)}K`;
    return val.toString();
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bottleneckCount = nodes.filter(n => getNodeStatus(n) !== 'healthy').length;

  return (
    <section className="relative py-24 sm:py-32 bg-slate-50 dark:bg-[#0d1f33] overflow-hidden">
      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 mb-6 transition-all duration-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Interactive Demo</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight transition-all duration-700 delay-150 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            See where startups break
            <br />
            <span className="gradient-text">before you do</span>
          </h2>
        </div>

        {/* Simulator */}
        <div
          className={`rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-700 delay-300 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Top bar */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Architecture Stress Test</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Drag the slider to simulate user growth</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Critical</span>
              </div>
            </div>
          </div>

          {/* Architecture diagram */}
          <div className="relative p-6 sm:p-8">
            <svg viewBox="0 0 100 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto', aspectRatio: '1/1' }}>
              {/* Connections */}
              {connections.map(([from, to], i) => {
                const fromNode = nodes.find(n => n.id === from)!;
                const toNode = nodes.find(n => n.id === to)!;
                const color = getConnectionColor(from, to);
                const width = getConnectionWidth();
                return (
                  <g key={i}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={color}
                      strokeWidth={width * 0.15}
                      opacity={0.4}
                      strokeLinecap="round"
                    />
                    {/* Animated flow dot */}
                    {users > 0 && (
                      <circle r={0.8} fill={color} opacity={0.8}>
                        <animateMotion
                          dur={`${3 - (users / 1000000) * 2}s`}
                          repeatCount="indefinite"
                          path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const status = getNodeStatus(node);
                const colors = getStatusColor(status);
                const isHovered = hoveredNode === node.id;
                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    {/* Glow */}
                    {status !== 'healthy' && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? 7 : 5}
                        fill={colors.glow}
                        className={status === 'critical' ? 'animate-pulse' : ''}
                      />
                    )}
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 5 : 4}
                      fill={isHovered ? colors.fill : 'white'}
                      stroke={colors.stroke}
                      strokeWidth={0.5}
                      className="transition-all duration-300 dark:fill-[#0d1f33]"
                      style={isHovered ? { fill: colors.fill } : {}}
                    />
                    {/* Label */}
                    <text
                      x={node.x}
                      y={node.y - 6}
                      textAnchor="middle"
                      className="fill-gray-700 dark:fill-gray-300 text-[2.5px] font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {node.label}
                    </text>
                    {/* Tooltip */}
                    {isHovered && status !== 'healthy' && (
                      <g>
                        <rect
                          x={node.x - 20}
                          y={node.y + 6}
                          width={40}
                          height={6}
                          rx={1}
                          fill={status === 'critical' ? '#FEE2E2' : '#FEF3C7'}
                          stroke={colors.stroke}
                          strokeWidth={0.2}
                          className="dark:fill-gray-800"
                        />
                        <text
                          x={node.x}
                          y={node.y + 10}
                          textAnchor="middle"
                          className="text-[2px] font-medium"
                          style={{ fontFamily: 'Inter, sans-serif', fill: colors.fill }}
                        >
                          {node.tooltip}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Controls */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Slider */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>0 users</span>
                <span className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                  {formatUsers(users)} users
                </span>
                <span>1,000,000 users</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000000}
                step={5000}
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Status bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bottlenecks:</span>
                <span className={`text-sm font-bold ${bottleneckCount === 0 ? 'text-green-500' : bottleneckCount < 4 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {bottleneckCount} / {nodes.length}
                </span>
              </div>

              {users > 300000 && (
                <div className="flex items-center gap-2 text-sm text-red-500 font-medium animate-fade-in">
                  <AlertTriangle className="w-4 h-4" />
                  This is where most startups break. I fix this permanently.
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => scrollTo('#contact')}
              className="mt-6 w-full sm:w-auto group flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02]"
            >
              Book a Free Architecture Audit
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottleneckSimulator;
