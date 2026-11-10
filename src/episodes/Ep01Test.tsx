import { Composition, useVideoConfig, Sequence, useCurrentFrame, interpolate } from "remotion";
import React from "react";
import { NeonStage } from "../components/NeonStage";
import { JemAvatar } from "../components/JemAvatar";
import { WireframeBox } from "../components/WireframeBox";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { SubtitleBar } from "../components/SubtitleBar";

export const Ep01Test: React.FC = () => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const phoneIcon = (
    <g stroke="#00F5D4" strokeWidth={2} fill="none">
      <rect x={-40} y={-80} width={80} height={160} rx={12} />
      <circle cx={0} cy={55} r={8} />
    </g>
  );

  const subtitleWords = [
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
  ];

  return (
    <NeonStage enableCamera={true}>
      <Sequence from={0} durationInFrames={900}>
        <JemAvatar
          x={540}
          y={1200}
          scale={1.2}
          tieColor="gold"
          animated={true}
        />
      </Sequence>

      <Sequence from={60} durationInFrames={600}>
        <WireframeBox
          x={540}
          y={700}
          size={180}
          label="PHONE"
          icon={phoneIcon}
          color="cyan"
          rotationSpeed={0.003}
          animated={true}
        />
      </Sequence>

      <Sequence from={120} durationInFrames={180}>
        <AnimatedCounter
          x={540}
          y={500}
          from={0}
          to={1000}
          prefix="$"
          color="gold"
          durationFrames={180}
          fontSize={80}
        />
      </Sequence>

      <Sequence from={300} durationInFrames={300}>
        <WireframeBox
          x={540}
          y={400}
          size={120}
          label="ALERT"
          color="red"
          rotationSpeed={0.005}
          animated={true}
        />
      </Sequence>

      <Sequence from={0} durationInFrames={900}>
        <SubtitleBar
          words={subtitleWords}
          y={1650}
          color="white"
          fontSize={32}
        />
      </Sequence>
    </NeonStage>
  );
};

export const Ep01TestComposition = () => (
  <Composition
    id="Ep01Test"
    component={Ep01Test}
    width={1080}
    height={1920}
    fps={60}
    durationInFrames={900}
    defaultProps={{}}
  />
);

export default Ep01Test;