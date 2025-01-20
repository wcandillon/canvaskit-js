import { ColorFactory } from "./Data";
import type { BlurProps } from "./imageFilters";
import { BlurImageFilter } from "./imageFilters";
import type { ColorMatrixImageFilterProps } from "./imageFilters/ColorMatrix";
import { ColorMatrixImageFilter } from "./imageFilters/ColorMatrix";
import { ColorShader } from "./shaders";
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

class ImageFilterFactory {
  constructor(private device: GPUDevice) {}

  MakeBlur(props: BlurProps) {
    return new BlurImageFilter(this.device, props);
  }

  MakeColorMatrix(props: ColorMatrixImageFilterProps) {
    return new ColorMatrixImageFilter(this.device, props);
  }
}

class ShaderFactory {
  constructor(
    private device: GPUDevice,
    private colorFactory: typeof ColorFactory
  ) {}

  MakeColor(color: Float32Array | string) {
    return new ColorShader(this.device, this.colorFactory(color));
  }
}

export class Instance {
  public ImageFilter: ImageFilterFactory;
  public Surface: SurfaceFactory;
  public Shader: ShaderFactory;
  public Color = ColorFactory;

  constructor(device: GPUDevice) {
    this.Surface = new SurfaceFactory(device);
    this.ImageFilter = new ImageFilterFactory(device);
    this.Shader = new ShaderFactory(device, this.Color);
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
