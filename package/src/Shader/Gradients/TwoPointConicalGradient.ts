import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { Gradient } from "./Gradient";

export class TwoPointConicalGradient extends Gradient {
  constructor(
    private readonly c1: InputPoint,
    private readonly r1: number,
    private readonly c2: InputPoint,
    private readonly r2: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
  }

  paintTexture(ctx: OffscreenCanvasRenderingContext2D) {
    const { r1, r2, c1, c2 } = this;
    const grd = ctx.createRadialGradient(c1[0], c1[1], r1, c2[0], c2[1], r2);
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    this.fill(ctx);
    return ctx.canvas.transferToImageBitmap();
  }
}
