import { Shader, type Texture } from "./Shader";
import { TextureShaderContext } from "./TextureShaderContext";

abstract class GradientTexture implements Texture {
  protected texture = new OffscreenCanvas(0, 0);
  protected ctx = this.texture.getContext("2d")!;
  protected gradient: CanvasGradient;
  protected positions: number[];

  constructor(
    protected colors: string[],
    positions: number[] | null,
    factory: (
      ctx: OffscreenCanvasRenderingContext2D,
      colors: string[],
      positions: number[]
    ) => CanvasGradient
  ) {
    this.positions = positions
      ? positions
      : this.colors.map((_, i) => i / (this.colors.length - 1));
    this.gradient = factory(this.ctx, this.colors, this.positions);
  }

  render(width: number, height: number, _ctm: DOMMatrix): OffscreenCanvas {
    this.texture.width = width;
    this.texture.height = height;
    this.ctx.fillStyle = this.gradient;
    this.ctx.fillRect(0, 0, width, height);
    return this.texture;
  }
}

class LinearGradientTexture extends GradientTexture {
  constructor(
    start: DOMPoint,
    end: DOMPoint,
    colors: string[],
    positions?: number[]
  ) {
    super(
      colors,
      positions ?? null,
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
    );
  }
}

export class LinearGradient extends Shader {
  constructor(
    start: DOMPoint,
    end: DOMPoint,
    colors: string[],
    positions?: number[]
  ) {
    const ctx = new TextureShaderContext();
    super(ctx, {}, [new LinearGradientTexture(start, end, colors, positions)]);
  }
}
