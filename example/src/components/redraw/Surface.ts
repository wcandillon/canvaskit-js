import { Recorder } from "./Recorder";

export class Surface {
  private recorder: Recorder;

  constructor(device: GPUDevice, private getCurrentTexture: () => GPUTexture) {
    const resolution = Float32Array.of(
      this.getCurrentTexture().width,
      this.getCurrentTexture().height
    );
    this.recorder = new Recorder(device, resolution);
  }

  getRecorder() {
    return this.recorder;
  }

  flush() {
    this.recorder.flush(this.getCurrentTexture());
  }
}
