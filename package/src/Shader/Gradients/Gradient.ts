import type { Color, InputFlexibleColorArray } from "canvaskit-wasm";

import { nativeColor, uIntColorToCanvasKitColor } from "../../Core";
import { ShaderJS } from "../Shader";

export abstract class Gradient extends ShaderJS {
  protected colors: string[];
  protected pos: number[];

  constructor(colors: InputFlexibleColorArray, pos: number[] | null) {
    super();
    this.colors = normalizeInputColorArray(colors).map((c) => nativeColor(c));
    this.pos = pos
      ? pos
      : this.colors.map((_, i) => i / (this.colors.length - 1));
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

const normalizeInputColorArray = (input: InputFlexibleColorArray) => {
  if (input instanceof Float32Array || input instanceof Uint32Array) {
    const colors: Color[] = [];
    for (let i = 0; i < input.length; i += 4) {
      const result = input.subarray(i, i + 4);
      if (result instanceof Float32Array) {
        colors.push(result);
      } else {
        colors.push(
          ...Array.from(result).map((c) => uIntColorToCanvasKitColor(c))
        );
      }
    }
    return colors;
  } else {
    return input;
  }
};
