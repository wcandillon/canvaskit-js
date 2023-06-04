import type { TurbulenceType } from "../ImageFilter/SVG";
import { svgCtx, TurbulenceFilter } from "../ImageFilter/SVG";

import { ShaderJS } from "./Shader";

export class NoiseShader extends ShaderJS {
  private static count = 0;

  private id: string;

  constructor(
    readonly baseFreqY: number,
    readonly baseFreqX: number,
    readonly octaves: number,
    readonly seed: number,
    readonly type: TurbulenceType = "fractalNoise"
  ) {
    super();
    this.id = `filter-${NoiseShader.count}`;
    NoiseShader.count++;
    const filter = new TurbulenceFilter(
      baseFreqX,
      baseFreqY,
      octaves,
      seed,
      type
    );
    svgCtx.create(this.id, [filter]);
  }

  dispose() {
    svgCtx.disposeFilter(this.id);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    ctx.filter = `url(#${this.id})`;
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(ctx.canvas, 0, 0);
    return ctx.canvas.transferToImageBitmap();
  }
}
