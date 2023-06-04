import { createTexture } from "../Core";
import type { TurbulenceType } from "../ImageFilter/SVG";
import { svgCtx, TurbulenceFilter } from "../ImageFilter/SVG";

import { ShaderJS } from "./Shader";

export class NoiseShader extends ShaderJS {
  private static count = 0;

  private id: string;
  private ctx: CanvasRenderingContext2D;

  constructor(
    readonly baseFreqY: number,
    readonly baseFreqX: number,
    readonly octaves: number,
    readonly seed: number,
    readonly type: TurbulenceType = "fractalNoise"
  ) {
    super();
    this.id = `shader-${NoiseShader.count}`;
    NoiseShader.count++;
    const filter = new TurbulenceFilter(
      baseFreqX,
      baseFreqY,
      octaves,
      seed,
      type
    );
    svgCtx.create(this.id, [filter]);
    this.ctx = createTexture(0, 0);
  }

  dispose() {
    svgCtx.disposeFilter(this.id);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.filter = `url(#${this.id})`;
    this.ctx.fillRect(0, 0, width, height);
    ctx.drawImage(this.ctx.canvas, 0, 0);
    return ctx.canvas.transferToImageBitmap();
  }
}
