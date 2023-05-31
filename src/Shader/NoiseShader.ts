import { SVGFilter } from "../SVG";

import { ShaderJS } from "./Shader";

export class NoiseShader extends ShaderJS {
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
    private readonly tileH: number,
    private readonly type: "turbulence" | "fractalNoise" = "fractalNoise"
  ) {
    super();
    NoiseShader.count++;
    this.id = `fractal-noise-${NoiseShader.count}`;
  }

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const filter = new SVGFilter(this.id);
    filter.addNoise(
      this.baseFreqX,
      this.baseFreqY,
      this.octaves,
      this.seed,
      this.tileW,
      this.tileH,
      this.type
    );
    ctx.filter = filter.create();
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
  }
}
