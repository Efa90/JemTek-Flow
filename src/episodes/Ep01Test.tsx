import { AbsoluteFill, Canvas, Composition, interpolate, registerRoot, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo } from "react";

const GOLD = "#FFD166";
const CYAN = "#00F5D4";
const RED = "#FF3366";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

const floorY = 1350;
const durationInFrames = 900;
const fps = 60;

const NeonGlow = ({ children, color = WHITE, intensity = 1 }: { children: React.ReactNode; color?: string; intensity?: number }) => (
  <g style={{ filter: `drop-shadow(0 0 ${4 * intensity}px ${color}) drop-shadow(0 0 ${8 * intensity}px ${color})` }}>
    {children}
  </g>
);

const NeonGlowStrong = ({ children, color = WHITE }: { children: React.ReactNode; color?: string }) => (
  <g style={{ filter: `drop-shadow(0 0 ${8}px ${color}) drop-shadow(0 0 ${16}px ${color})` }}>
    {children}
  </g>
);

const ReflectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <g
    transform={`translate(0, ${floorY * 2}) scale(1, -1)`}
    style={{ opacity: 0.2, filter: "blur(4px)" }}
  >
    {children}
  </g>
);

const FloorGrid = () => {
  const gridLines = useMemo(() => {
    const lines = [];
    const spacing = 60;
    for (let x = -540; x <= 540; x += spacing) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={-1920}
          x2={x}
          y2={0}
          stroke={CYAN}
          strokeWidth={1}
          strokeDasharray="15,10"
          opacity={0.3}
          style={{ filter: `drop-shadow(0 0 3px ${CYAN})` }}
        />
      );
    }
    for (let y = -1920; y <= 0; y += spacing) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={-540}
          y1={y}
          x2={540}
          y2={y}
          stroke={CYAN}
          strokeWidth={1}
          strokeDasharray="15,10"
          opacity={0.3}
          style={{ filter: `drop-shadow(0 0 3px ${CYAN})` }}
        />
      );
    }
    return lines;
  }, []);

  return (
    <g transform={`translate(540, ${floorY})`}>
      {gridLines}
      <line
        x1={-540}
        y1={0}
        x2={540}
        y2={0}
        stroke={GOLD}
        strokeWidth={2}
        strokeDasharray="20,15"
        opacity={0.6}
        style={{ filter: `drop-shadow(0 0 4px ${GOLD})` }}
      />
    </g>
  );
};

const DustParticle = ({ x, y, size, opacity, delay, duration }: { x: number; y: number; size: number; opacity: number; delay: number; duration: number }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;
  if (localFrame < 0 || localFrame > duration) return null;
  const progress = localFrame / duration;
  const currentY = y - progress * 200;
  const currentOpacity = opacity * (1 - progress) * Math.sin(progress * Math.PI);
  return <circle cx={x} cy={currentY} r={size} fill={WHITE} opacity={currentOpacity} />;
};

const DustField = () => {
  const { width, height } = useVideoConfig();
  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < 40; i++) {
      p.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.05,
        delay: Math.random() * durationInFrames,
        duration: Math.random() * 60 + 30,
      });
    }
    return p;
  }, [width, height]);

  return (
    <g>
      {particles.map((p, i) => (
        <DustParticle key={i} {...p} />
      ))}
    </g>
  );
};

const JemAvatar = ({ x = 540, y = 1200, scale = 1, animated = true }: { x?: number; y?: number; scale?: number; animated?: boolean }) => {
  const frame = useCurrentFrame();
  const glowIntensity = animated ? interpolate(frame / fps % 2, [0, 1], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <NeonGlow color={WHITE} intensity={glowIntensity * 0.9}>
        <path d="M-80,0 L-60,-40 L-60,-140 L60,-140 L60,-40 L80,0 Z" fill="none" stroke={WHITE} strokeWidth={3} />
        <circle cx={0} cy={-170} r={40} fill="none" stroke={WHITE} strokeWidth={3} />
      </NeonGlow>
      <NeonGlowStrong color={GOLD}>
        <path d="M-15,-40 L0,-100 L15,-40 Z" fill={GOLD} />
        <circle cx={0} cy={-40} r={6} fill={GOLD} />
      </NeonGlowStrong>
      <NeonGlow color={GOLD} intensity={glowIntensity}>
        <circle cx={-12} cy={-175} r={3} fill={GOLD} />
        <circle cx={12} cy={-175} r={3} fill={GOLD} />
      </NeonGlow>
    </g>
  );
};

const WireframeBox = ({
  x = 540,
  y = 800,
  size = 200,
  label,
  color = "cyan",
  rotationSpeed = 0.002,
  animated = true,
}: { x?: number; y?: number; size?: number; label?: string; color?: "gold" | "cyan" | "red" | "white"; rotationSpeed?: number; animated?: boolean }) => {
  const frame = useCurrentFrame();
  const colors = { gold: GOLD, cyan: CYAN, red: RED, white: WHITE };
  const strokeColor = colors[color];
  const rotation = animated ? frame * rotationSpeed : 0;
  const floatY = animated ? Math.sin(frame * 0.02) * 15 : 0;
  const half = size / 2;

  const vertices = useMemo(() => [
    [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
    [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half],
  ], [size]);

  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];

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
    <g transform={`translate(${x}, ${y + floatY})`} style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}>
      {edges.map(([a, b], i) => {
        const va = projectedVertices[a];
        const vb = projectedVertices[b];
        return <line key={i} x1={va.x} y1={va.y} x2={vb.x} y2={vb.y} stroke={strokeColor} strokeWidth={2} opacity={0.8} />;
      })}
      {label && <text x={0} y={half + 40} textAnchor="middle" fill={strokeColor} fontSize={24} fontFamily="monospace" fontWeight="bold" opacity={0.9}>{label}</text>}
    </g>
  );
};

const PhoneIcon = () => (
  <g stroke={CYAN} strokeWidth={2} fill="none">
    <rect x={-40} y={-80} width={80} height={160} rx={12} />
    <circle cx={0} cy={55} r={8} />
  </g>
);

const AnimatedCounter = ({
  x = 540,
  y = 800,
  from = 0,
  to = 1000,
  prefix = "$",
  color = "gold",
  durationFrames = 180,
  fontSize = 72,
  delay = 0,
}: { x?: number; y?: number; from?: number; to?: number; prefix?: string; color?: "gold" | "cyan" | "red" | "white"; durationFrames?: number; fontSize?: number; delay?: number }) => {
  const frame = useCurrentFrame();
  const colors = { gold: GOLD, cyan: CYAN, red: RED, white: WHITE };
  const textColor = colors[color];
  const progress = Math.max(0, Math.min(1, (frame - delay) / durationFrames));
  const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  const currentValue = Math.round(interpolate(easedProgress, [0, 1], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const formattedValue = currentValue.toLocaleString();
  const glowOpacity = 0.6 + easedProgress * 0.4;

  return (
    <g transform={`translate(${x}, ${y})`} style={{ filter: `drop-shadow(0 0 4px ${textColor})` }}>
      <text x={0} y={0} textAnchor="middle" dominantBaseline="central" fill={textColor} fontSize={fontSize} fontFamily="monospace" fontWeight="bold" opacity={glowOpacity} paintOrder="stroke fill" stroke={textColor} strokeWidth={1}>
        {prefix}{formattedValue}
      </text>
    </g>
  );
};

const SubtitleBar = ({ words }: { words: Array<{ text: string; startFrame: number; endFrame: number }> }) => {
  const frame = useCurrentFrame();
  const activeWords = useMemo(() => words.filter(w => frame >= w.startFrame && frame <= w.endFrame), [words, frame]);
  if (activeWords.length === 0) return null;

  return (
    <g transform={`translate(540, 1650)`} style={{ filter: `drop-shadow(0 0 4px ${WHITE})` }}>
      {activeWords.map((word, i) => (
        <text
          key={i}
          x={0}
          y={i * 44}
          textAnchor="middle"
          dominantBaseline="central"
          fill={WHITE}
          fontSize={32}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
          opacity={interpolate(frame, [word.startFrame, word.startFrame + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
                 interpolate(frame, [word.endFrame - 5, word.endFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          paintOrder="stroke fill"
          stroke={WHITE}
          strokeWidth={0.5}
        >
          {word.text}
        </text>
      ))}
    </g>
  );
};

const Ep01Test = () => {
  const { width, height } = useVideoConfig();
  const subtitleWords = useMemo(() => [
    { text: "JemTek Flow", startFrame: 0, endFrame: 60 },
    { text: "Automated", startFrame: 60, endFrame: 120 },
    { text: "Shorts Pipeline", startFrame: 120, endFrame: 180 },
    { text: "Neon Wireframe", startFrame: 180, endFrame: 240 },
    { text: "Style", startFrame: 240, endFrame: 300 },
    { text: "Deployed", startFrame: 300, endFrame: 360 },
    { text: "On GitHub", startFrame: 360, endFrame: 420 },
    { text: "Actions", startFrame: 420, endFrame: 480 },
    { text: "Zero", startFrame: 480, endFrame: 540 },
    { text: "Local", startFrame: 540, endFrame: 600 },
    { text: "Compute", startFrame: 600, endFrame: 660 },
    { text: "Required", startFrame: 660, endFrame: 720 },
    { text: "Gold", startFrame: 720, endFrame: 780 },
    { text: "Cyan", startFrame: 780, endFrame: 840 },
    { text: "Red", startFrame: 840, endFrame: 900 },
  ], []);

  return (
    <AbsoluteFill style={{ background: BLACK }}>
      <Canvas width={width} height={height}>
        <DustField />
        <FloorGrid />
        <JemAvatar scale={1.2} animated />
        <WireframeBox y={700} size={180} label="PHONE" color="cyan" rotationSpeed={0.003}>
          <PhoneIcon transform="translate(0, -120) scale(0.5)" />
        </WireframeBox>
        <AnimatedCounter y={500} from={0} to={1000} prefix="$" color="gold" durationFrames={180} fontSize={80} delay={120} />
        <WireframeBox y={400} size={120} label="ALERT" color="red" rotationSpeed={0.005} delay={300} />
        <SubtitleBar words={subtitleWords} />
        <ReflectionWrapper>
          <JemAvatar scale={1.2} animated />
          <WireframeBox y={700} size={180} label="PHONE" color="cyan" rotationSpeed={0.003}>
            <PhoneIcon transform="translate(0, -120) scale(0.5)" />
          </WireframeBox>
          <AnimatedCounter y={500} from={0} to={1000} prefix="$" color="gold" durationFrames={180} fontSize={80} delay={120} />
          <WireframeBox y={400} size={120} label="ALERT" color="red" rotationSpeed={0.005} delay={300} />
        </ReflectionWrapper>
      </Canvas>
    </AbsoluteFill>
  );
};

const Root = () => (
  <Composition
    id="Ep01Test"
    component={Ep01Test}
    width={1080}
    height={1920}
    fps={60}
    durationInFrames={900}
  />
);

registerRoot(Root);
export { Ep01Test };