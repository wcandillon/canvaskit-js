import { Canvas } from "./Canvas";
import { makeTexturePipeline } from "./drawings/Texture";
import { BlendMode } from "./Paint/BlendMode";

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
    const commands = this.canvas.popDrawingCommands();
    // 1. Create Textures for image filters
    commands.forEach(({ pipeline, bindGroup, vertexCount, paint }) => {
      if (paint.getImageFilter()) {
        const texture = this.makeTexture();
        const passEncoder = commandEncoder.beginRenderPass(
          makeRenderPassDescriptor(texture)
        );
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(vertexCount);
        passEncoder.end();
        paint.getImageFilter()!.texture = texture;
      }
    });
    const passEncoder = commandEncoder.beginRenderPass(
      makeRenderPassDescriptor(this.getCurrentTexture())
    );
    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });
    commands.forEach(({ pipeline, bindGroup, vertexCount, paint }) => {
      if (!paint.getImageFilter()) {
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(vertexCount);
      } else {
        const renderPipeline = makeTexturePipeline(
          device,
          paint.getBlendMode()
        );
        passEncoder.setPipeline(renderPipeline);
        const textureBindGroup = device.createBindGroup({
          layout: renderPipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: sampler,
            },
            {
              binding: 1,
              resource: paint.getImageFilter()!.texture!.createView(),
            },
          ],
        });
        passEncoder.setBindGroup(0, textureBindGroup);
        passEncoder.draw(6);
      }
    });
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  private makeTexture() {
    return this.device.createTexture({
      size: [this.width, this.height],
      format: this.getCurrentTexture().format,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
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
