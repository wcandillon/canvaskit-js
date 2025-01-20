import { Surface } from "./Surface";

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

export class RedrawInstance {
  public Surface: SurfaceFactory;

  constructor(device: GPUDevice) {
    this.Surface = new SurfaceFactory(device);
  }
}
