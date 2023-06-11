import type { Shader } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class ShaderJS extends HostObject<Shader> implements Shader {
  private texture: ImageBitmap | null = null;
  protected children: ShaderJS[] | null;

  constructor(...children: ShaderJS[]) {
    super();
    this.children = children.length > 0 ? children : null;
  }

  abstract paintTexture(ctx: OffscreenCanvasRenderingContext2D): ImageBitmap;

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    if (!this.texture) {
      this.texture = this.paintTexture(ctx);
    }
    return this.texture;
  }

  dispose() {
    if (this.texture) {
      this.texture.close();
      this.texture = null;
    }
    if (this.children) {
      this.children.forEach((child) => child.dispose());
    }
  }

  protected fill(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;
    const m = ctx.getTransform().invertSelf();
    const topLeft = new DOMPoint(0, 0).matrixTransform(m);
    const topRight = new DOMPoint(width, 0).matrixTransform(m);
    const bottomRight = new DOMPoint(
      ctx.canvas.width,
      ctx.canvas.height
    ).matrixTransform(m);
    const bottomLeft = new DOMPoint(0, height).matrixTransform(m);
    ctx.beginPath();
    ctx.moveTo(topLeft.x, topLeft.y);
    ctx.lineTo(topRight.x, topRight.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.fill();
  }
}
