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

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const { c1, r1, c2, r2 } = this;
    const grd = ctx.createRadialGradient(c1[0], c1[1], r1, c2[0], c2[1], r2);
    this.colors.forEach((color, i) => {
      // TODO: NativeColor should already be set
      grd.addColorStop(this.pos[i], color);
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas.transferToImageBitmap();
  }
}
