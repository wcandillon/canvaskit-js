import type {
  Image,
  Canvas,
  ImageInfo,
  InputIRect,
  PartialImageInfo,
  Surface,
  TextureSource,
} from "canvaskit-wasm";

import { IndexedHostObject } from "./HostObject";
import { CanvasJS } from "./Canvas";
import { ImageJS } from "./Image";
import { GrDirectContextJS, rectToXYWH } from "./Core";
import { SVGContext } from "./SVG/SVGContext";
import { CanvasProxyHandler } from "./Core/CanvasProxyHandler";

export class SurfaceJS extends IndexedHostObject<Surface> implements Surface {
  private canvas: Canvas;
  private svgCtx: SVGContext;
  private grCtx: GrDirectContextJS;
  private ctx: CanvasRenderingContext2D;
  private proxyHandler: CanvasProxyHandler | null = null;

  constructor(
    ctx: CanvasRenderingContext2D,
    grCtx?: GrDirectContextJS,
    debug = false
  ) {
    super("surface");
    // TODO: move everything to GrDirectContextJS: SVGContext, CanvasRenderingContext2D
    this.svgCtx = new SVGContext(this.id);
    this.grCtx = grCtx ?? new GrDirectContextJS(ctx);
    if (debug) {
      this.proxyHandler = new CanvasProxyHandler();
      this.ctx = new Proxy(ctx, this.proxyHandler);
    } else {
      this.ctx = ctx;
    }
    this.canvas = new CanvasJS(this.ctx, this.svgCtx, this.grCtx);
  }
  drawOnce(drawFrame: (_: Canvas) => void): void {
    this.requestAnimationFrame(drawFrame);
  }
  dispose(): void {
    this.svgCtx.dispose();
  }
  flush(): void {
    if (this.proxyHandler) {
      this.proxyHandler.flush();
    }
  }
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
  requestAnimationFrame(drawFrame: (_: Canvas) => void): number {
    return requestAnimationFrame(() => {
      drawFrame(this.canvas);
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
