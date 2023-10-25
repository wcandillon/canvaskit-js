import { CustomTexture } from "./Gradients";
import type { Shader } from "./Shader";

export class BlendShader extends CustomTexture {
  constructor(
    private blendMode: GlobalCompositeOperation,
    private child1: Shader,
    private child2: Shader
  ) {
    super();
  }

  draw(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    const t1 = this.child1.render(width, height);
    ctx.globalCompositeOperation = this.blendMode;
    ctx.drawImage(t1, 0, 0);
    const t2 = this.child2.render(width, height);
    ctx.drawImage(t2, 0, 0);
  }
}
