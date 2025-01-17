import { Canvas } from "./Canvas";
import { ColorFactory } from "./Data";

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
    return new Surface(this.device, () => ctx.getCurrentTexture());
  }

  MakeOffscreen(width: number, height: number) {
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    const texture = this.device.createTexture({
      size: { width, height },
      format: presentationFormat,
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    return new Surface(this.device, () => texture);
  }
}

export class Instance {
  public Surface: SurfaceFactory;
  public Color = ColorFactory;

  constructor(device: GPUDevice) {
    this.Surface = new SurfaceFactory(device);
  }

  static async get() {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("WebGPU not supported");
    }
    if (!adapter.features.has("dual-source-blending")) {
      // Fall back to the multiple pipeline approach
      throw new Error("Dual source blending not supported");
    }
    const device = await adapter.requestDevice({
      requiredFeatures: ["dual-source-blending"],
    } as const);
    return new Instance(device);
  }
}
