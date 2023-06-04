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
import { rectToXYWH } from "./Core";

export class SurfaceJS extends HostObject<Surface> implements Surface {
  private canvas: Canvas;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
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
    return this.ctx.canvas.height;
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
          width: this.width(),
          height: this.height(),
        };
    const data = this.ctx.getImageData(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );
    return new ImageJS(data);
  }
  makeSurface(_info: ImageInfo): Surface {
    throw new Error("Method not implemented.");
  }
  reportBackendTypeIsGPU(): boolean {
    return true; //-ish
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
