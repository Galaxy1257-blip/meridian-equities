import React from 'react';
import { MeridianAxisScore, SnowflakeScore } from '../types';

interface MeridianAxisRadarProps {
  score: MeridianAxisScore;
  size?: number;
  showLabels?: boolean;
}

export const MeridianAxisRadar: React.FC<MeridianAxisRadarProps> = ({
  score,
  size = 220,
  showLabels = true
}) => {
  const center = size / 2;
  const maxRadius = (size / 2) - (showLabels ? 32 : 10);

  // 5 Meridian Axes: Value (top), Future Growth (top right), Past (bottom right), Health (bottom left), Dividend (top left)
  const axes = [
    { name: 'Value', key: 'value', value: score.value, angle: -Math.PI / 2 },
    { name: 'Future', key: 'future', value: score.future, angle: -Math.PI / 2 + (2 * Math.PI / 5) },
    { name: 'Past', key: 'past', value: score.past, angle: -Math.PI / 2 + (4 * Math.PI / 5) },
    { name: 'Health', key: 'health', value: score.health, angle: -Math.PI / 2 + (6 * Math.PI / 5) },
    { name: 'Dividend', key: 'dividend', value: score.dividend, angle: -Math.PI / 2 + (8 * Math.PI / 5) }
  ];

  // Helper to get coordinates
  const getCoordinates = (angle: number, radiusRatio: number) => {
    const r = radiusRatio * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for the stock's score (value 0-6)
  const polygonPoints = axes.map((axis) => {
    const ratio = Math.max(0.1, axis.value / 6);
    const coords = getCoordinates(axis.angle, ratio);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Background concentric polygons
  const concentricLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="meridianAxisGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="meridianAxisStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        {/* Concentric Grid Rings */}
        {concentricLevels.map((lvl) => {
          const points = axes.map((a) => {
            const c = getCoordinates(a.angle, lvl);
            return `${c.x},${c.y}`;
          }).join(' ');

          return (
            <polygon
              key={lvl}
              points={points}
              className="fill-none stroke-slate-200 dark:stroke-slate-800"
              strokeWidth={lvl === 1.0 ? '1.5' : '1'}
              strokeDasharray={lvl === 1.0 ? 'none' : '3 3'}
            />
          );
        })}

        {/* Axis Spokes */}
        {axes.map((a) => {
          const edge = getCoordinates(a.angle, 1.0);
          return (
            <line
              key={a.key}
              x1={center}
              y1={center}
              x2={edge.x}
              y2={edge.y}
              className="stroke-slate-200 dark:stroke-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* Score Meridian Axis Polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#meridianAxisGlow)"
          stroke="url(#meridianAxisStroke)"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out filter drop-shadow-md"
        />

        {/* Vertex Point Dots */}
        {axes.map((a) => {
          const ratio = Math.max(0.1, a.value / 6);
          const coords = getCoordinates(a.angle, ratio);
          return (
            <g key={a.key}>
              <circle
                cx={coords.x}
                cy={coords.y}
                r="4.5"
                className="fill-white dark:fill-slate-900 stroke-cyan-400"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {showLabels && axes.map((a) => {
          const labelCoords = getCoordinates(a.angle, 1.18);
          return (
            <text
              key={a.key}
              x={labelCoords.x}
              y={labelCoords.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300 font-mono uppercase"
            >
              {a.name} ({a.value}/6)
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export const SnowflakeRadar = MeridianAxisRadar;
export type SnowflakeRadarProps = MeridianAxisRadarProps;
