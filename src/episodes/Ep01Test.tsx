import { AbsoluteFill, Composition, interpolate, registerRoot, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useMemo } from "react";

const GOLD = "#FFD166";
const CYAN = "#00F5D4";
const RED = "#FF3366";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

const durationInFrames = 900;
const fps = 60;
const floorY = 1350;

const subtitleWords = [
  { text: "JemTek Flow", start: 0, end: 60 },
  { text: "Automated", start: 60, end: 120 },
  { text: "Shorts Pipeline", start: 120, end: 180 },
  { text: "Neon Wireframe", start: 180, end: 240 },
  { text: "Style", start: 240, end: 300 },
  { text: "Deployed", start: 300, end: 360 },
  { text: "On GitHub", start: 360, end: 420 },
  { text: "Actions", start: 420, end: 480 },
  { text: "Zero", start: 480, end: 540 },
  { text: "Local", start: 540, end: 600 },
  { text: "Compute", start: 600, end: 660 },
  { text: "Required", start: 660, end: 720 },
  { text: "Gold", start: 720, end: 780 },
  { text: "Cyan", start: 780, end: 840 },
  { text: "Red", start: 840, end: 900 },
];

const Ep01Test = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const counterValue = Math.floor(interpolate(frame, [60, 400], [0, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const counterStr = counterValue.toLocaleString();

  const activeWords = useMemo(() => subtitleWords.filter(w => frame >= w.start && frame <= w.end), [frame]);

  return (
    <AbsoluteFill style={{ background: BLACK, width, height, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width, height, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: floorY, left: 0, width, borderTop: `2px dashed ${CYAN}`, opacity: 0.6 }} />
        <div
          style={{
            position: "absolute",
            top: floorY * 2,
            left: 0,
            width,
            height: height - floorY * 2,
            transform: "scaleY(-1)",
            transformOrigin: "top",
            opacity: 0.2,
            filter: "blur(4px)",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "absolute", top: height - floorY * 2 - 400, left: width / 2 - 100, width: 200, height: 300 }}>
            <div style={{ position: "absolute", top: 160, left: 60, width: 80, height: 80, borderRadius: "50%", border: `3px solid ${WHITE}`, boxShadow: `0 0 15px ${WHITE}`, opacity: 0.7 }} />
            <div style={{ position: "absolute", top: 80, left: 50, width: 100, height: 120, border: `3px solid ${WHITE}`, borderRadius: "0 0 20px 20px", boxShadow: `0 0 15px ${WHITE}`, opacity: 0.7 }} />
            <div style={{ position: "absolute", top: 200, left: 70, width: 60, height: 80, background: GOLD, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", boxShadow: `0 0 20px ${GOLD}` }} />
            <div style={{ position: "absolute", top: 180, left: 82, width: 8, height: 8, borderRadius: "50%", background: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
            <div style={{ position: "absolute", top: 180, left: 110, width: 8, height: 8, borderRadius: "50%", background: GOLD, boxShadow: `0 0 10px ${GOLD}` }} />
          </div>
          <div style={{ position: "absolute", top: height - floorY * 2 - 300, left: width / 2 - 90, width: 180, height: 180, border: `3px solid ${CYAN}`, boxShadow: `0 0 25px ${CYAN}`, borderRadius: "12px", transform: `rotate(${frame * 0.003}rad)` }} />
          <div style={{ position: "absolute", top: height - floorY * 2 - 500, left: width / 2 - 80, fontSize: 72, fontFamily: "monospace", fontWeight: "bold", color: GOLD, textShadow: `0 0 10px ${GOLD}, 0 0 20px ${GOLD}`, textAlign: "center", width: 160 }}>
            ${counterStr}
          </div>
          <div style={{ position: "absolute", top: height - floorY * 2 - 600, left: width / 2 - 60, width: 120, height: 120, border: `3px solid ${RED}`, boxShadow: `0 0 25px ${RED}`, borderRadius: "12px", transform: `rotate(${frame * 0.005}rad)` }} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 0, left: 0, width, height }}>
        <div style={{ position: "absolute", top: floorY, left: 0, width, borderTop: `2px dashed ${CYAN}`, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 950, left: width / 2 - 100, width: 200, height: 300 }}>
          <div style={{ position: "absolute", top: 160, left: 60, width: 80, height: 80, borderRadius: "50%", border: `3px solid ${WHITE}`, boxShadow: `0 0 15px ${WHITE}`, opacity: 0.7 }} />
          <div style={{ position: "absolute", top: 80, left: 50, width: 100, height: 120, border: `3px solid ${WHITE}`, borderRadius: "0 0 20px 20px", boxShadow: `0 0 15px ${WHITE}`, opacity: 0.7 }} />
          <div style={{ position: "absolute", top: 200, left: 70, width: 60, height: 80, background: GOLD, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", boxShadow: `0 0 20px ${GOLD}` }} />
          <div style={{ position: "absolute", top: 180, left: 82, width: 8, height: 8, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
          <div style={{ position: "absolute", top: 180, left: 110, width: 8, height: 8, borderRadius: "50%", background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
        </div>
        <div style={{ position: "absolute", top: 700, left: width / 2 - 90, width: 180, height: 180, border: `3px solid ${CYAN}`, boxShadow: `0 0 25px ${CYAN}`, borderRadius: "12px", transform: `rotate(${frame * 0.003}rad)` }} />
        <div style={{ position: "absolute", top: 500, left: width / 2 - 80, fontSize: 72, fontFamily: "monospace", fontWeight: "bold", color: GOLD, textShadow: `0 0 10px ${GOLD}, 0 0 20px ${GOLD}`, textAlign: "center", width: 160 }}>
          ${counterStr}
        </div>
        <div style={{ position: "absolute", top: 400, left: width / 2 - 60, width: 120, height: 120, border: `3px solid ${RED}`, boxShadow: `0 0 25px ${RED}`, borderRadius: "12px", transform: `rotate(${frame * 0.005}rad)` }} />
      </div>

      <div style={{ position: "absolute", bottom: 100, left: 0, width, textAlign: "center", pointerEvents: "none" }}>
        {activeWords.map((w, i) => (
          <div
            key={i}
            style={{
              display: "inline-block",
              fontSize: 32,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              color: WHITE,
              textShadow: `0 0 8px ${WHITE}`,
              marginBottom: 8,
              opacity: interpolate(frame, [w.start, w.start + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
                       interpolate(frame, [w.end - 5, w.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {w.text}
          </div>
        ))}
      </div>
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