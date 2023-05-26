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
import { CanvasLite } from "./Canvas";
import { ImageLite } from "./Image";

export class SurfaceLite extends HostObject<Surface> implements Surface {
  private canvas: Canvas;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    super();
    this.canvas = new CanvasLite(this.ctx);
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
    return new ImageLite(this.ctx.canvas.toDataURL());
  }
  makeSurface(_info: ImageInfo): Surface {
    throw new Error("Method not implemented.");
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
