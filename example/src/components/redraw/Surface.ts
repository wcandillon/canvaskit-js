import { Canvas } from "./Canvas";
import { makeTexturePipeline } from "./drawings/Texture";

export class Surface {
  private canvas: Canvas;
  private sampler: GPUSampler;
  private textureCount = 0;
  private texturePool: GPUTexture[] = [];

  constructor(
    private device: GPUDevice,
    private getCurrentTexture: () => GPUTexture
  ) {
    const resolution = Float32Array.of(
      this.getCurrentTexture().width,
      this.getCurrentTexture().height
    );
    this.canvas = new Canvas(device, resolution);
    this.sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });
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
        const input = this.makeTexture();
        const passEncoder = commandEncoder.beginRenderPass(
          makeRenderPassDescriptor(input)
        );
        group.forEach(({ pipeline, bindGroup, instance, vertexCount }) => {
          passEncoder.setPipeline(pipeline);
          passEncoder.setBindGroup(0, bindGroup);
          passEncoder.draw(vertexCount, 1, 0, instance);
        });
        passEncoder.end();
        const textureA = this.makeTexture();
        const textureB = this.makeTexture();
        imageFilter.apply(commandEncoder, input, textureA, textureB);
      }
    });
    // 2. Draw all the commands
    const passEncoder = commandEncoder.beginRenderPass(
      makeRenderPassDescriptor(this.getCurrentTexture())
    );
    groups.forEach((group) => {
      const [{ paint }] = group;
      const imageFilter = paint.getImageFilter();
      if (imageFilter) {
        const result = imageFilter.getResult();
        const pipeline = makeTexturePipeline(device, paint.getBlendMode());
        const showResultBindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: this.sampler,
            },
            {
              binding: 1,
              resource: result.createView(),
            },
          ],
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, showResultBindGroup);
        passEncoder.draw(6);
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
    this.textureCount = 0;
  }

  private makeTexture() {
    if (this.texturePool[this.textureCount]) {
      return this.texturePool[this.textureCount++];
    } else {
      const format = navigator.gpu.getPreferredCanvasFormat();
      const texture = this.device.createTexture({
        size: [this.width, this.height],
        format,
        usage:
          GPUTextureUsage.RENDER_ATTACHMENT |
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.COPY_SRC,
      });
      this.texturePool.push(texture);
      this.textureCount++;
      return texture;
    }
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
