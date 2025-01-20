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

  getRecorder() {
    return this.recorder;
  }

  flush() {
    const commandEncoder = this.device.createCommandEncoder({
      label: "Surface encoder",
    });
    const view = this.getCurrentTexture().createView();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view,
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear",
          storeOp: "store",
        } as const,
      ],
    });
    passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }
}
