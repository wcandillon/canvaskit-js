import { Canvas } from "./Canvas";
import { ColorFactory } from "./Data";

class Surface {
  private canvas: Canvas;
  private commandEncoder: GPUCommandEncoder;

  constructor(
    private device: GPUDevice,
    private texture: GPUTexture,
    private pd = window.devicePixelRatio
  ) {
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

  get width() {
    return this.texture.width / this.pd;
  }

  get height() {
    return this.texture.height / this.pd;
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
      console.warn(
        "Dual source blending not supported, falling back to multiple pipelines"
      );
    }
    const device = await adapter.requestDevice({
      requiredFeatures: ["dual-source-blending"] as const,
    });
    return new Instance(device);
  }
}
