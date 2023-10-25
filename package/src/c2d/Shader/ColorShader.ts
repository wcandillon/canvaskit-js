import { CustomTexture } from "./Gradients";

export class ColorShader extends CustomTexture {
  constructor(private color: string) {
    super();
  }

  draw(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
