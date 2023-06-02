import { ShaderJS } from "./Shader";

export class ImageShader extends ShaderJS {
  constructor(private readonly image: HTMLCanvasElement) {
    super();
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, 0);
    return ctx.canvas.transferToImageBitmap();
  }
}
