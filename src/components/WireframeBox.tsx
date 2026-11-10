import { useVideoConfig, useCurrentFrame } from "remotion";
import React, { useMemo } from "react";

interface WireframeBoxProps {
  x?: number;
  y?: number;
  size?: number;
  label?: string;
  icon?: React.ReactNode;
  color?: "gold" | "cyan" | "red" | "white";
  rotationSpeed?: number;
  animated?: boolean;
}

export const WireframeBox: React.FC<WireframeBoxProps> = ({
  x = 540,
  y = 800,
  size = 200,
  label,
  icon,
  color = "cyan",
  rotationSpeed = 0.002,
  animated = true,
}) => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const colors = {
    gold: "#FFD166",
    cyan: "#00F5D4",
    red: "#FF3366",
    white: "#FFFFFF",
  };

  const strokeColor = colors[color];
  const rotation = animated ? frame * rotationSpeed : 0;
  const floatY = animated ? Math.sin(frame * 0.02) * 15 : 0;

  const half = size / 2;

  const vertices = useMemo(() => [
    [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
    [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half],
  ], [size]);

  const edges = useMemo(() => [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ], []);

  const project = (vertex: number[], angle: number) => {
    const [x, y, z] = vertex;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const rx = x * cos - z * sin;
    const rz = x * sin + z * cos;
    const scale = 500 / (500 + rz);
    return { x: rx * scale, y: y * scale };
  };

  const projectedVertices = vertices.map(v => project(v, rotation));

  return (
    <g
      transform={`translate(${x}, ${y + floatY})`}
      filter="url(#neon-glow)"
    >
      {edges.map(([a, b], i) => {
        const va = projectedVertices[a];
        const vb = projectedVertices[b];
        return (
          <line
            key={i}
            x1={va.x}
            y1={va.y}
            x2={vb.x}
            y2={vb.y}
            stroke={strokeColor}
            strokeWidth={2}
            opacity={0.8}
          />
        );
      })}
      {label && (
        <text
          x={0}
          y={half + 40}
          textAnchor="middle"
          fill={strokeColor}
          fontSize={24}
          fontFamily="monospace"
          fontWeight="bold"
          opacity={0.9}
        >
          {label}
        </text>
      )}
      {icon && (
        <g transform={`translate(0, ${-half - 30}) scale(0.5)`}>
          {icon}
        </g>
      )}
    </g>
  );
};

export default WireframeBox;