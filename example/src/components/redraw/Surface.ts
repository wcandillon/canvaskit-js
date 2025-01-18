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
    const commandEncoder = device.createCommandEncoder({
      label: "Redraw encoder",
    });
    const groups = this.canvas.popDrawingCommands();
    // 1. All commands that have an image filter are drawn on an offscreen texture
    groups.forEach((group) => {
      const imageFilter = group[0].paint.getImageFilter();
      if (imageFilter) {
        const texture = this.makeTexture();
        const passEncoder = commandEncoder.beginRenderPass(
          makeRenderPassDescriptor(texture)
        );
        group.forEach(({ pipeline, bindGroup, instance, vertexCount }) => {
          passEncoder.setPipeline(pipeline);
          passEncoder.setBindGroup(0, bindGroup);
          passEncoder.draw(vertexCount, 1, 0, instance);
        });
        passEncoder.end();
      }
    });
    // 2. Draw all the commands
    const passEncoder = commandEncoder.beginRenderPass(
      makeRenderPassDescriptor(this.getCurrentTexture())
    );
    groups.forEach((group) => {
      const imageFilter = group[0].paint.getImageFilter();
      if (imageFilter) {
      } else {
        group.forEach(({ pipeline, bindGroup, instance, vertexCount }) => {
          passEncoder.setPipeline(pipeline);
          passEncoder.setBindGroup(0, bindGroup);
          passEncoder.draw(vertexCount, 1, 0, instance);
        });
      }
    });
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  // private makeStorageTexture() {
  //   return this.device.createTexture({
  //     size: [this.width, this.height],
  //     format: "rgba8unorm",
  //     usage:
  //       GPUTextureUsage.STORAGE_BINDING |
  //       GPUTextureUsage.TEXTURE_BINDING |
  //       GPUTextureUsage.COPY_DST |
  //       GPUTextureUsage.COPY_SRC,
  //   });
  // }

  private makeTexture() {
    const format = navigator.gpu.getPreferredCanvasFormat();
    return this.device.createTexture({
      size: [this.width, this.height],
      format,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.COPY_SRC,
    });
  }
}

const makeRenderPassDescriptor = (texture: GPUTexture) => {
  const view = texture.createView();
  return {
    colorAttachments: [
      {
        view,
        clearValue: [0, 0, 0, 0], // Clear to transparent
        loadOp: "clear",
        storeOp: "store",
      } as const,
    ],
  };
};
