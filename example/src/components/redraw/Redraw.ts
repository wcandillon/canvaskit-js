import { mat4 } from "wgpu-matrix";

import { CircleShader } from "./drawings/Circle";
import { Fill } from "./drawings/Fill";
import type { Color, Matrix, Point } from "./Data";
import { makeUniform } from "./Uniform";

export class Paint {
  color: Color | null = null;
  constructor() {}

  setColor(r: number, g: number, b: number, a: number) {
    this.color = Float32Array.of(r, g, b, a);
  }
}

interface Context {
  matrix: Matrix;
}

class Canvas {
  private contextes: Context[] = [{ matrix: mat4.identity() }];

  constructor(
    private device: GPUDevice,
    public passEncoder: GPURenderPassEncoder,
    private width: number,
    private height: number
  ) {}

  get ctx() {
    return this.contextes[this.contextes.length - 1];
  }

  save() {
    this.contextes.push({ matrix: this.ctx.matrix.slice() });
  }

  scale(x: number, y: number) {
    const m = this.ctx.matrix;
    mat4.scale(m, [x, y, 1], m);
  }

  restore() {
    this.contextes.pop();
  }

  fill(paint: Paint) {
    const { device } = this;
    const drawing = new Fill(device);
    drawing.draw(this.passEncoder, { color: paint.color! });
  }

  drawCircle(pos: Point, r: number, paint: Paint) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const { device } = this;
    const module = device.createShaderModule({
      code: CircleShader,
    });
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      label: "Circle",
      vertex: {
        module,
      },
      fragment: {
        module,
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
    this.passEncoder.setPipeline(pipeline);
    const uniform = makeUniform({
      resolution: Float32Array.of(this.width, this.height),
      center: pos,
      radius: Float32Array.of(r),
      matrix: this.ctx.matrix,
      color: paint.color!,
    });
    const buffer = this.device.createBuffer({
      label: "uniforms for drawCircle",
      size: uniform.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(buffer, 0, uniform);
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    this.passEncoder.setBindGroup(0, bindGroup);
    this.passEncoder.draw(6);
  }
}

class Surface {
  private canvas: Canvas;
  private commandEncoder: GPUCommandEncoder;

  constructor(private device: GPUDevice, texture: GPUTexture) {
    this.commandEncoder = device.createCommandEncoder({
      label: "Redraw encoder",
    });
    const view = texture.createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear" as const,
          storeOp: "store" as const,
        },
      ],
    };

    const passEncoder =
      this.commandEncoder.beginRenderPass(renderPassDescriptor);
    this.canvas = new Canvas(
      device,
      passEncoder,
      texture.width,
      texture.height
    );
  }

  getCanvas() {
    return this.canvas;
  }

  flush() {
    const { device } = this;
    this.canvas.passEncoder.end();
    device.queue.submit([this.commandEncoder.finish()]);
  }
}

class SurfaceFactory {
  constructor(private device: GPUDevice) {}

  MakeFromCanvas(canvas: HTMLCanvasElement): Surface {
    const { devicePixelRatio } = window;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const { device } = this;
    const ctx = canvas.getContext("webgpu");
    if (!ctx) {
      throw new Error("WebGPU not supported");
    }
    ctx.configure({
      device,
      format: presentationFormat,
      alphaMode: "premultiplied",
    });
    return new Surface(this.device, ctx.getCurrentTexture());
  }

  MakeOffscreen(width: number, height: number) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const texture = this.device.createTexture({
      size: { width, height },
      format: presentationFormat,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    return new Surface(this.device, texture);
  }
}

export class Instance {
  public Surface: SurfaceFactory;

  constructor(device: GPUDevice) {
    this.Surface = new SurfaceFactory(device);
  }
}
