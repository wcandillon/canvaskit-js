import { CircleFragment } from "./drawings/Circle";
import { QuadVertex } from "./drawings/Quad";

type Point = Float32Array;
type Color = Float32Array;

export class Paint {
  constructor() {}
}

interface Drawing {
  pipeline: GPURenderPipeline;
  vertexCount: number;
}

class Canvas {
  drawings: Drawing[] = [];

  constructor(private device: GPUDevice) {}

  drawCircle(pos: Point, r: number, paint: Paint) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const { device } = this;
    const pipeline = device.createRenderPipeline({
      layout: "auto",
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
    this.drawings.push({ pipeline, vertexCount: 6 });
  }
}

class Surface {
  private canvas: Canvas;
  constructor(private device: GPUDevice, private texture: GPUTexture) {
    this.canvas = new Canvas(device);
  }

  getCanvas() {
    return this.canvas;
  }

  flush() {
    const { device, texture } = this;
    const commandEncoder = device.createCommandEncoder();
    const view = texture.createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: [0, 0, 0, 0], // Clear to transparent
          loadOp: "clear" as const,
          storeOp: "store" as const,
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    this.canvas.drawings.forEach(({ pipeline, vertexCount }) => {
      passEncoder.setPipeline(pipeline);
      passEncoder.draw(vertexCount);
      passEncoder.end();
    });

    device.queue.submit([commandEncoder.finish()]);
  }
}

class SurfaceFactory {
  constructor(private device: GPUDevice) {}

  MakeFromCanvas(canvas: HTMLCanvasElement): Surface {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const { device } = this;
    const ctx = canvas.getContext("webgpu");
    if (!ctx) {
      throw new Error("WebGPU not supported");
    }
    ctx.configure({
      device,
      format: presentationFormat,
      alphaMode: "opaque",
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
