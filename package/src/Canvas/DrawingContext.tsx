import { createTexture } from "../Core";
import type { ImageFilterJS } from "../ImageFilter";

interface Context {
  ctx: CanvasRenderingContext2D | null;
  ctm: DOMMatrix;
  clip: Path2D | null;
  filter?: ImageFilterJS;
  layer?: boolean;
}

export class DrawingContext {
  private stack: Context[] = [];

  constructor(ctx: CanvasRenderingContext2D | null = null) {
    this.stack.push({
      ctx: ctx,
      ctm: new DOMMatrix(),
      clip: null,
    });
  }

  get ctx() {
    return this.current.ctx;
  }

  get current() {
    return this.stack[this.stack.length - 1];
  }

  saveCount() {
    return this.stack.length;
  }

  save() {
    const { ctx, ctm, clip } = this.current;
    if (ctx !== null) {
      ctx.save();
    }
    this.stack.push({
      ctx: ctx,
      ctm,
      clip,
    });
    return this.stack.length;
  }

  saveLayer(imageFilter?: ImageFilterJS | null) {
    const { ctx, ctm, clip } = this.current;
    if (ctx === null) {
      return this.save();
    }
    const { canvas } = ctx;
    const { width, height } = canvas;
    const layer = createTexture(width, height);
    this.stack.push({
      ctx: layer,
      ctm,
      clip,
      filter: imageFilter ?? undefined,
      layer: true,
    });
    return this.stack.length;
  }

  restore() {
    const { ctx } = this.current;
    if (ctx) {
      ctx.restore();
    }
    return this.stack.pop();
  }

  transform(transform: DOMMatrix2DInit) {
    const { ctx } = this.current;
    this.current.ctm = this.current.ctm.multiply(transform);
    if (ctx) {
      ctx.setTransform(this.current.ctm);
    }
  }

  clip(clip: Path2D) {
    const { ctx } = this.current;
    if (ctx) {
      ctx.clip(clip);
    }
    this.current.clip = clip;
  }
}
