import { useVideoConfig, interpolateColors } from "remotion";
import React, { useMemo } from "react";

export const JemAvatar: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  tieColor?: "gold" | "cyan";
  animated?: boolean;
}> = ({
  x = 540,
  y = 1200,
  scale = 1,
  tieColor = "gold",
  animated = true,
}) => {
  const { frame, fps } = useVideoConfig();

  const tieColors = {
    gold: "#FFD166",
    cyan: "#00F5D4",
  };

  const glowIntensity = animated
    ? interpolateColors(frame / fps % 2, [0, 1], [0.6, 1])
    : 1;

  const avatar = useMemo(() => (
    <g filter="url(#neon-glow)">
      {/* Torso */}
      <path
        d="M-80,0 L-60,-40 L-60,-140 L60,-140 L60,-40 L80,0 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={3}
        opacity={0.9 * glowIntensity}
      />
      {/* Head */}
      <circle
        cx={0}
        cy={-170}
        r={40}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={3}
        opacity={0.9 * glowIntensity}
      />
      {/* Tie */}
      <path
        d="M-15,-40 L0,-100 L15,-40 Z"
        fill={tieColors[tieColor]}
        opacity={0.9 * glowIntensity}
        filter="url(#neon-glow-strong)"
      />
      {/* Tie knot */}
      <circle
        cx={0}
        cy={-40}
        r={6}
        fill={tieColors[tieColor]}
        opacity={glowIntensity}
        filter="url(#neon-glow-strong)"
      />
      {/* Eyes - subtle glow */}
      <circle
        cx={-12}
        cy={-175}
        r={3}
        fill={tieColors[tieColor]}
        opacity={glowIntensity}
        filter="url(#neon-glow)"
      />
      <circle
        cx={12}
        cy={-175}
        r={3}
        fill={tieColors[tieColor]}
        opacity={glowIntensity}
        filter="url(#neon-glow)"
      />
    </g>
  ), [tieColor, glowIntensity]);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {avatar}
    </g>
  );
};

export default JemAvatar;