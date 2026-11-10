import { interpolate, spring, useCurrentFrame } from "remotion";
import React from "react";

interface AnimatedCounterProps {
  x?: number;
  y?: number;
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  color?: "gold" | "cyan" | "red" | "white";
  durationFrames?: number;
  fontSize?: number;
  delay?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  x = 540,
  y = 800,
  from = 0,
  to = 1000,
  prefix = "$",
  suffix = "",
  color = "gold",
  durationFrames = 90,
  fontSize = 72,
  delay = 0,
}) => {
  const frame = useCurrentFrame();

  const colors = {
    gold: "#FFD166",
    cyan: "#00F5D4",
    red: "#FF3366",
    white: "#FFFFFF",
  };

  const textColor = colors[color];

  const progress = spring({
    frame: frame - delay,
    fps: 60,
    config: { damping: 120, stiffness: 180 },
  });

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const currentValue = Math.round(interpolate(clampedProgress, [0, 1], [from, to]));

  const formattedValue = currentValue.toLocaleString();

  const glowOpacity = 0.6 + clampedProgress * 0.4;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      filter="url(#neon-glow)"
    >
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={fontSize}
        fontFamily="monospace"
        fontWeight="bold"
        opacity={glowOpacity}
        paintOrder="stroke fill"
        stroke={textColor}
        strokeWidth={1}
      >
        {prefix}{formattedValue}{suffix}
      </text>
    </g>
  );
};

export default AnimatedCounter;