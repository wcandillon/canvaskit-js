import { Canvas } from "./Canvas";

export class Surface {
  private canvas: Canvas;

  constructor(
    private device: GPUDevice,
    private getCurrentTexture: () => GPUTexture
  ) {
    const resolution = Float32Array.of(
      this.getCurrentTexture().width,
      this.getCurrentTexture().height
    );
    this.canvas = new Canvas(device, resolution);
  }

  get width() {
    return this.getCurrentTexture().width;
  }

  get height() {
    return this.getCurrentTexture().height;
  }

  getCanvas() {
    return this.canvas;
  }

  flush() {
    const { device } = this;
    const view = this.getCurrentTexture().createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear",
          storeOp: "store",
        } as const,
      ],
    };
    const commandEncoder = device.createCommandEncoder({
      label: "Redraw encoder",
    });
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    const commands = this.canvas.popDrawingCommands();
    commands.forEach(({ pipeline, bindGroup, vertexCount }) => {
      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.draw(vertexCount);
    });
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  private makeTexture() {
    return this.device.createTexture({
      size: [this.width, this.height],
      format: this.getCurrentTexture().format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }
}
