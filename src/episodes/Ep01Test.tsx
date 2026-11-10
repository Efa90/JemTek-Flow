import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Ep01Test = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Helvetica',
      }}
    >
      <div
        style={{
          opacity,
          color: '#FFD166',
          fontSize: '70px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        JemTek Cloud Render
      </div>
      <div
        style={{
          opacity,
          color: '#00F5D4',
          fontSize: '35px',
          marginTop: '20px',
        }}
      >
        Automated 60fps Pipeline
      </div>
    </AbsoluteFill>
  );
};
