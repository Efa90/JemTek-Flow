import { interpolate, useCurrentFrame } from "remotion";
import React, { useMemo } from "react";

interface SubtitleBarProps {
  words: Array<{ text: string; startFrame: number; endFrame: number }>;
  y?: number;
  color?: "gold" | "cyan" | "red" | "white";
  fontSize?: number;
  maxWidth?: number;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({
  words,
  y = 1700,
  color = "white",
  fontSize = 36,
  maxWidth = 900,
}) => {
  const frame = useCurrentFrame();

  const colors = {
    gold: "#FFD166",
    cyan: "#00F5D4",
    red: "#FF3366",
    white: "#FFFFFF",
  };

  const textColor = colors[color];

  const activeWords = useMemo(() => {
    return words.filter(w => frame >= w.startFrame && frame <= w.endFrame);
  }, [words, frame]);

  if (activeWords.length === 0) return null;

  return (
    <g
      transform={`translate(540, ${y})`}
      filter="url(#neon-glow)"
    >
      {activeWords.map((word, i) => (
        <text
          key={i}
          x={0}
          y={i * (fontSize + 8)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={fontSize}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
          opacity={interpolate(frame, [word.startFrame, word.startFrame + 5], [0, 1]) *
                 interpolate(frame, [word.endFrame - 5, word.endFrame], [1, 0])}
          paintOrder="stroke fill"
          stroke={textColor}
          strokeWidth={0.5}
        >
          {word.text}
        </text>
      ))}
    </g>
  );
};

export default SubtitleBar;