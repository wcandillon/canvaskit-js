import { createTexture } from "../Core/Platform";
import { SVGFilter } from "../SVG";

import { ShaderJS } from "./Shader";

export class NoiseShader extends ShaderJS {
  private static count = 0;
  private ctx: CanvasRenderingContext2D;
  private filter: SVGFilter;
  private filterURL: string;

  constructor(
    private readonly baseFreqX: number,
    private readonly baseFreqY: number,
    private readonly octaves: number,
    private readonly seed: number,
    private readonly tileW: number,
    private readonly tileH: number,
    private readonly type: "turbulence" | "fractalNoise" = "fractalNoise"
  ) {
    super();
    NoiseShader.count++;
    const id = `fractal-noise-${NoiseShader.count}`;
    this.ctx = createTexture(0, 0);
    this.filter = new SVGFilter(id);
    this.filter.addNoise(
      this.baseFreqX,
      this.baseFreqY,
      this.octaves,
      this.seed,
      this.tileW,
      this.tileH,
      this.type
    );
    this.filterURL = this.filter.create();
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.filter = this.filterURL;
    ctx.fillStyle = "transparent";
    this.ctx.fillRect(0, 0, width, height);
    ctx.drawImage(this.ctx.canvas, 0, 0);
    return ctx.canvas.transferToImageBitmap();
  }
}
