import { Shader, type Texture } from "./Shader";
import { TextureShaderContext } from "./TextureShaderContext";

class CustomTexture implements Texture {
  protected texture = new OffscreenCanvas(0, 0);
  protected ctx = this.texture.getContext("2d")!;

  constructor(private draw: (ctx: OffscreenCanvasRenderingContext2D) => void) {}

  render(width: number, height: number, _ctm: DOMMatrix) {
    this.texture.width = width;
    this.texture.height = height;
    this.draw(this.ctx);
    return this.texture;
  }
}

class GradientTexture extends CustomTexture {
  constructor(
    colors: string[],
    positions: number[] | undefined,
    factory: (
      ctx: OffscreenCanvasRenderingContext2D,
      colors: string[],
      positions: number[]
    ) => CanvasGradient
  ) {
    const pos = positions
      ? positions
      : colors.map((_, i) => i / (colors.length - 1));
    super((ctx: OffscreenCanvasRenderingContext2D) => {
      ctx.fillStyle = factory(ctx, colors, pos);
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
  }
}

export class LinearGradient extends Shader {
  constructor(
    start: DOMPoint,
    end: DOMPoint,
    colors: string[],
    positions?: number[]
  ) {
    const shaderCtx = new TextureShaderContext();
    super(shaderCtx, {}, [
      new GradientTexture(
        colors,
        positions,
        (
          ctx: OffscreenCanvasRenderingContext2D,
          cls: string[],
          pos: number[]
        ) => {
          const gradient = ctx.createLinearGradient(
            start.x,
            start.y,
            end.x,
            end.y
          );
          cls.forEach((color, i) => {
            gradient.addColorStop(pos[i], color);
          });
          return gradient;
        }
      ),
    ]);
  }
}

export class TwoPointConicalGradient extends Shader {
  constructor(
    c1: DOMPoint,
    r1: number,
    c2: DOMPoint,
    r2: number,
    colors: string[],
    positions?: number[]
  ) {
    const shaderCtx = new TextureShaderContext();
    super(shaderCtx, {}, [
      new GradientTexture(
        colors,
        positions,
        (
          ctx: OffscreenCanvasRenderingContext2D,
          cls: string[],
          pos: number[]
        ) => {
          const gradient = ctx.createRadialGradient(
            c1.x,
            c1.y,
            r1,
            c2.x,
            c2.y,
            r2
          );
          cls.forEach((color, i) => {
            gradient.addColorStop(pos[i], color);
          });
          return gradient;
        }
      ),
    ]);
  }
}

export class SweepGradient extends Shader {
  constructor(
    c: DOMPoint,
    angle: number,
    colors: string[],
    positions?: number[]
  ) {
    const shaderCtx = new TextureShaderContext();
    super(shaderCtx, {}, [
      new GradientTexture(
        colors,
        positions,
        (
          ctx: OffscreenCanvasRenderingContext2D,
          cls: string[],
          pos: number[]
        ) => {
          const gradient = ctx.createConicGradient(angle, c.x, c.y);
          cls.forEach((color, i) => {
            gradient.addColorStop(pos[i], color);
          });
          return gradient;
        }
      ),
    ]);
  }
}

export class CustomShader extends Shader {
  constructor(draw: (ctx: OffscreenCanvasRenderingContext2D) => void) {
    const shaderCtx = new TextureShaderContext();
    super(shaderCtx, {}, [new CustomTexture(draw)]);
  }
}
