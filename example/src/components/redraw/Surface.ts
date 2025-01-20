import type { InstanciatedDrawingCommand } from "./Canvas";
import { Canvas } from "./Canvas";
import { makeTexturePipeline } from "./drawings/Texture";
import type { Shader } from "./shaders";

export class Surface {
  private canvas: Canvas;
  private sampler: GPUSampler;

  private textureCount = 0;
  private texturePool: GPUTexture[] = [];
  private shaders: Map<Shader, GPUTexture> = new Map();
  // Bind group for texture sampling when not needed
  private dummyBindGroup: GPUBindGroup;
  private dummyTexture: GPUTexture;

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
    const layout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "filtering" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "float" },
        },
      ] as const,
    });
    this.dummyTexture = device.createTexture({
      size: { width: 1, height: 1 },
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });
    this.dummyBindGroup = device.createBindGroup({
      layout,
      entries: [
        {
          binding: 0,
          resource: this.sampler,
        },
        {
          binding: 1,
          resource: this.dummyTexture.createView(),
        },
      ],
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
    // 0. All shaders are drawn on an offscreen texture
    // 1. All commands that have an image filter are drawn on an offscreen texture
    groups.forEach((group) => {
      const [{ paint }] = group;
      const imageFilter = paint.getImageFilter();
      if (imageFilter) {
        const input = this.makeTexture();
        const passEncoder = commandEncoder.beginRenderPass(
          makeRenderPassDescriptor(input)
        );
        this.drawGroup(passEncoder, group);
        passEncoder.end();
        const textureA = this.makeTexture();
        const textureB = this.makeTexture();
        imageFilter.apply(commandEncoder, input, textureA, textureB);
      }
      group.forEach((command) => {
        const shader = command.paint.getShader();
        if (shader) {
          const input = this.makeTexture();
          shader.apply(commandEncoder, input);
          this.shaders.set(shader, input);
        }
      });
    });
    // 2. Draw all the commands
    const passEncoder = commandEncoder.beginRenderPass(
      makeRenderPassDescriptor(this.getCurrentTexture())
    );
    groups.forEach((group) => {
      const [{ paint }] = group;
      const imageFilter = paint.getImageFilter();
      if (imageFilter) {
        const result = imageFilter.shiftResult();
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
        passEncoder.draw(3);
      } else {
        this.drawGroup(passEncoder, group);
      }
    });
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
    this.textureCount = 0;
    this.shaders.clear();
  }

  private drawGroup(
    passEncoder: GPURenderPassEncoder,
    group: InstanciatedDrawingCommand[]
  ) {
    group.forEach(({ pipeline, bindGroup, instance, vertexCount, paint }) => {
      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, bindGroup);
      const shader = paint.getShader();
      if (shader) {
        const texture = this.shaders.get(shader);
        if (!texture) {
          throw new Error("Shader texture not found");
        }
        const view = texture.createView();
        const layout = pipeline.getBindGroupLayout(1);
        const shaderBindGroup = this.device.createBindGroup({
          label: "shaderBindGroup for " + pipeline.label,
          layout,
          entries: [
            {
              binding: 0,
              resource: this.sampler,
            },
            {
              binding: 1,
              resource: view,
            },
          ],
        });
        passEncoder.setBindGroup(1, shaderBindGroup);
      } else {
        const layout = pipeline.getBindGroupLayout(1);
        const view = this.dummyTexture.createView();
        const dummyBindGroup = this.device.createBindGroup({
          layout,
          entries: [
            {
              binding: 0,
              resource: this.sampler,
            },
            {
              binding: 1,
              resource: view,
            },
          ],
        });
        passEncoder.setBindGroup(1, dummyBindGroup);
      }
      passEncoder.draw(vertexCount, 1, 0, instance);
    });
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
