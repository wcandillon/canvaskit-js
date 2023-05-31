import { addFilters, noise } from "../Filters";

import { ShaderJS } from "./Shader";

export class FractalNoise extends ShaderJS {
  // Because we use an SVG filter, we need to use a canvas element
  private canvas = document.createElement("canvas");

  private static count = 0;
  private readonly id: string;

  constructor(
    private readonly baseFreqX: number,
    private readonly baseFreqY: number,
    private readonly octaves: number,
    private readonly seed: number,
    private readonly tileW: number,
    private readonly tileH: number
  ) {
    super();
    FractalNoise.count++;
    this.id = `fractal-noise-${FractalNoise.count}`;
  }

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const n = noise(
      this.baseFreqX,
      this.baseFreqY,
      this.octaves,
      this.seed,
      this.tileW,
      this.tileH
    );
    addFilters(this.id, n);
    ctx.filter = `url(#${this.id})`;
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }
}
