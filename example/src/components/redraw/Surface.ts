import { Recorder } from "./Recorder";

export class Surface {
  private recorder: Recorder;

  constructor(
    private device: GPUDevice,
    private getCurrentTexture: () => GPUTexture
  ) {
    const resolution = Float32Array.of(
      this.getCurrentTexture().width,
      this.getCurrentTexture().height
    );
    this.recorder = new Recorder(device, resolution);
  }

  flush() {}
}
