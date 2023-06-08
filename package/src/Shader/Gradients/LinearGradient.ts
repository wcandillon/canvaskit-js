import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { Gradient } from "./Gradient";

export class LinearGradient extends Gradient {
  constructor(
    private readonly start: InputPoint,
    private readonly end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(colors, pos);
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(
      this.start[0],
      this.start[1],
      this.end[0],
      this.end[1]
    );
    this.colors.forEach((color, i) => {
      grd.addColorStop(this.pos[i], color);
    });
    // ctx.save();
    // ctx.setTransform(ctx.getTransform().invertSelf());
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //ctx.restore();
    return ctx.canvas.transferToImageBitmap();
  }
}
