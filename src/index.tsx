import { registerRoot, Composition } from "remotion";
import { Ep01Test } from "./episodes/Ep01Test";

registerRoot(() => (
  <Composition
    id="Ep01Test"
    component={Ep01Test}
    durationInFrames={900}
    fps={60}
    width={1080}
    height={1920}
  />
));