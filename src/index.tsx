import { registerRoot, Composition } from 'remotion';
import { Ep01Test } from './episodes/Ep01Test';

export const Root = () => {
  return (
    <Composition component={Ep01Test} durationInFrames={900} fps={60} height={1920} id="Ep01Test" width={1080}/>
  );
};

registerRoot(Root);