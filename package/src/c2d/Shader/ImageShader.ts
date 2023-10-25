import { CustomTexture } from "./Gradients";

export class ImageShader extends CustomTexture {
  constructor(
    private image: HTMLCanvasElement,
    private localMatrix?: DOMMatrix
  ) {
    super();
  }

  draw(ctx: OffscreenCanvasRenderingContext2D) {
    if (this.localMatrix) {
      ctx.setTransform(this.localMatrix);
    }
    ctx.drawImage(this.image, 0, 0);
  }
}
