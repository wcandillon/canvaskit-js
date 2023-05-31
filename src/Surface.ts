import type {
  Image,
  Canvas,
  ImageInfo,
  InputIRect,
  PartialImageInfo,
  Surface,
  TextureSource,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import { CanvasJS } from "./Canvas";
import { ImageJS } from "./Image";
import type { SkiaRenderingContext } from "./Values";
import { rectToXYWH } from "./Values";

export class SurfaceJS extends HostObject<Surface> implements Surface {
  private canvas: Canvas;

  constructor(private readonly ctx: SkiaRenderingContext) {
    super();
    this.canvas = new CanvasJS(this.ctx);
  }
  drawOnce(drawFrame: (_: Canvas) => void): void {
    this.requestAnimationFrame(drawFrame);
  }
  dispose(): void {}
  flush(): void {}
  getCanvas(): Canvas {
    return this.canvas;
  }
  height(): number {
    return this.ctx.canvas.width;
  }
  imageInfo(): ImageInfo {
    throw new Error("Method not implemented.");
  }
  makeImageFromTexture(_tex: WebGLTexture, _info: ImageInfo): Image | null {
    throw new Error("Method not implemented.");
  }
  makeImageFromTextureSource(
    _src: TextureSource,
    _info?: ImageInfo | PartialImageInfo | undefined,
    _srcIsPremul?: boolean | undefined
  ): Image | null {
    throw new Error("Method not implemented.");
  }
  makeImageSnapshot(_bounds?: InputIRect | undefined): Image {
    const bounds = _bounds
      ? rectToXYWH(_bounds)
      : {
          x: 0,
          y: 0,
          width: this.ctx.canvas.width,
          height: this.ctx.canvas.height,
        };
    const data = this.ctx.getImageData(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );
    return new ImageJS(data);
  }
  makeSurface(info: ImageInfo): Surface {
    const ctx = new OffscreenCanvas(info.width, info.height).getContext("2d")!;
    return new SurfaceJS(ctx);
  }
  reportBackendTypeIsGPU(): boolean {
    return true;
  }
  requestAnimationFrame(_drawFrame: (_: Canvas) => void): number {
    return requestAnimationFrame(() => {
      _drawFrame(this.canvas);
    });
  }
  sampleCnt(): number {
    throw new Error("Method not implemented.");
  }
  updateTextureFromSource(
    _img: Image,
    _src: TextureSource,
    _srcIsPremul?: boolean | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  width(): number {
    return this.ctx.canvas.width;
  }
}
