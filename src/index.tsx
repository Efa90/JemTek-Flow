import { registerRoot, Composition } from "remotion";
import { Ep01Test } from "./episodes/Ep01Test";

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