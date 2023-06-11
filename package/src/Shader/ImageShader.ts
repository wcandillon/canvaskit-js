import type { InputMatrix } from "canvaskit-wasm";

import { nativeMatrix } from "../Matrix3";

import { ShaderJS } from "./Shader";

export class ImageShader extends ShaderJS {
  private localMatrix: DOMMatrix | null = null;

  constructor(
    private readonly image: HTMLCanvasElement,
    localMatrix?: InputMatrix
  ) {
    super();
    if (localMatrix) {
      this.localMatrix = nativeMatrix(localMatrix);
    }
  }

  paintTexture(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.save();
    ctx.setTransform();
    if (this.localMatrix) {
      ctx.setTransform(this.localMatrix);
    }
    ctx.drawImage(this.image, 0, 0);
    ctx.restore();
    return ctx.canvas.transferToImageBitmap();
  }
}
