import type {
  Canvas,
  Image,
  ImageInfo,
  InputIRect,
  PartialImageInfo,
  Surface,
  TextureSource,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";

export class SurfaceLite extends HostObject<Surface> implements Surface {
  constructor(private readonly ctx: CanvasRenderingContext2D) {
    super();
  }
  drawOnce(_drawFrame: (_: Canvas) => void): void {
    throw new Error("Method not implemented.");
  }
  dispose(): void {}
  flush(): void {}
  getCanvas(): Canvas {}
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
    //this.ctx.canvas.toDataURL("image/jpeg");
    throw new Error("Method not implemented.");
  }
  makeSurface(_info: ImageInfo): Surface {
    throw new Error("Method not implemented.");
  }
  reportBackendTypeIsGPU(): boolean {
    throw new Error("Method not implemented.");
  }
  requestAnimationFrame(_drawFrame: (_: Canvas) => void): number {
    throw new Error("Method not implemented.");
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
