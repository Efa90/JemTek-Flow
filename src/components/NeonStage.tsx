import { AbsoluteFill, Canvas, interpolateColors, Sequence, useVideoConfig } from "remotion";
import React, { useMemo } from "react";

export const NeonStage: React.FC<{
  children: React.ReactNode;
  enableCamera?: boolean;
}> = ({ children, enableCamera = true }) => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const floorY = 1450;

  const glowFilter = useMemo(() => (
    <defs>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="neon-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="reflection-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
    </defs>
  ), []);

  const dustParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.3 + 0.05;
      const delay = Math.random() * durationInFrames;
      const duration = Math.random() * 60 + 30;
      particles.push(
        <DustParticle
          key={i}
          x={x}
          y={y}
          size={size}
          opacity={opacity}
          delay={delay}
          duration={duration}
          fps={fps}
          frame={0}
        />
      );
    }
    return particles;
  }, [width, height, durationInFrames, fps]);

  return (
    <AbsoluteFill style={{ background: "#000000" }}>
      <Canvas
        width={width}
        height={height}
        style={{ filter: "url(#neon-glow)" }}
      >
        {glowFilter}
        {dustParticles}
        <FloorLine y={floorY} width={width} />
        {enableCamera && <CameraWrapper floorY={floorY} />}
        {children}
        <ReflectionContainer floorY={floorY}>
          {children}
        </ReflectionContainer>
      </Canvas>
    </AbsoluteFill>
  );
};

const FloorLine: React.FC<{ y: number; width: number }> = ({ y, width }) => (
  <line
    x1={0}
    y1={y}
    x2={width}
    y2={y}
    stroke="#FFD166"
    strokeWidth={2}
    strokeDasharray="20,15"
    opacity={0.6}
    filter="url(#neon-glow)"
  />
);

const CameraWrapper: React.FC<{ floorY: number }> = ({ floorY, children }) => {
  const { frame } = useVideoConfig();
  const scale = interpolateColors(frame, [0, 300], [1, 1.02]);
  const translateY = interpolateColors(frame, [0, 300], [0, -20]);

  return (
    <g
      transform={`translate(540, ${floorY}) scale(${scale}) translate(-540, ${-floorY + translateY})`}
    >
      {children}
    </g>
  );
};

const ReflectionContainer: React.FC<{ floorY: number; children: React.ReactNode }> = ({
  floorY,
  children,
}) => (
  <g
    transform={`translate(0, ${floorY * 2}) scale(1, -1)`}
    filter="url(#reflection-blur)"
    opacity={0.18}
  >
    {children}
  </g>
);

interface DustParticleProps {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  fps: number;
  frame: number;
}

const DustParticle: React.FC<DustParticleProps> = ({
  x,
  y,
  size,
  opacity,
  delay,
  duration,
  fps,
}) => {
  const { frame } = useVideoConfig();
  const localFrame = frame - delay;

  if (localFrame < 0 || localFrame > duration) return null;

  const progress = localFrame / duration;
  const currentY = y - progress * 200;
  const currentOpacity = opacity * (1 - progress) * Math.sin(progress * Math.PI);

  return (
    <circle
      cx={x}
      cy={currentY}
      r={size}
      fill="#FFFFFF"
      opacity={currentOpacity}
    />
  );
};

export default NeonStage;