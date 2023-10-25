import { type Shader } from "./Shader";

// TODO: rename to CustomShader
export abstract class CustomTexture implements Shader {
  protected texture = new OffscreenCanvas(0, 0);
  protected ctx = this.texture.getContext("2d")!;

  constructor() {}

  abstract draw(ctx: OffscreenCanvasRenderingContext2D): void;

  render(width: number, height: number) {
    this.texture.width = width;
    this.texture.height = height;
    this.draw(this.ctx);
    return this.texture;
  }
}

abstract class GradientTexture extends CustomTexture {
  protected positions: number[];

  constructor(protected colors: string[], pos?: number[]) {
    super();
    this.positions = pos ? pos : colors.map((_, i) => i / (colors.length - 1));
  }

  draw(ctx: OffscreenCanvasRenderingContext2D) {
    const gradient = this.getGradient(ctx);
    this.colors.forEach((color, i) => {
      gradient.addColorStop(this.positions[i], color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  abstract getGradient(ctx: OffscreenCanvasRenderingContext2D): CanvasGradient;
}

export class LinearGradient extends GradientTexture {
  constructor(
    private start: DOMPoint,
    private end: DOMPoint,
    colors: string[],
    positions?: number[]
  ) {
    super(colors, positions);
  }

  getGradient(ctx: OffscreenCanvasRenderingContext2D) {
    const gradient = ctx.createLinearGradient(
      this.start.x,
      this.start.y,
      this.end.x,
      this.end.y
    );
    return gradient;
  }
}

export class TwoPointConicalGradient extends GradientTexture {
  constructor(
    private c1: DOMPoint,
    private r1: number,
    private c2: DOMPoint,
    private r2: number,
    colors: string[],
    positions?: number[]
  ) {
    super(colors, positions);
  }

  getGradient(ctx: OffscreenCanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.c1.x,
      this.c1.y,
      this.r1,
      this.c2.x,
      this.c2.y,
      this.r2
    );
    return gradient;
  }
}

export class SweepGradient extends GradientTexture {
  constructor(
    private c: DOMPoint,
    private angle: number,
    colors: string[],
    positions?: number[]
  ) {
    super(colors, positions);
  }

  getGradient(ctx: OffscreenCanvasRenderingContext2D) {
    const gradient = ctx.createConicGradient(this.angle, this.c.x, this.c.y);
    return gradient;
  }
}
