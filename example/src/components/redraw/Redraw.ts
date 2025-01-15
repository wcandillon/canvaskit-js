import { CircleFragment } from "./drawings/Circle";
import { QuadVertex } from "./drawings/Quad";

type Point = Float32Array;
type Color = Float32Array;

export class Paint {
  constructor() {}
}

class Canvas {
  constructor(
    private device: GPUDevice,
    public passEncoder: GPURenderPassEncoder
  ) {}

  drawCircle(pos: Point, r: number, paint: Paint) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const { device } = this;
    const pipeline = device.createRenderPipeline({
      layout: "auto",
      label: "Circle",
      vertex: {
        module: device.createShaderModule({
          code: QuadVertex,
        }),
      },
      fragment: {
        module: device.createShaderModule({
          code: CircleFragment,
        }),
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
    const uniformBuffer = this.device.createBuffer({
      label: "uniforms for drawCircle",
      size: 4 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(
      uniformBuffer,
      0,
      Float32Array.of(pos[0], pos[1], r, 0)
    );
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
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
    this.canvas = new Canvas(device, passEncoder);
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
