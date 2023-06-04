import type {
  Color,
  ColorSpace,
  EmbindEnumEntity,
  InputFlexibleColorArray,
  InputMatrix,
  InputPoint,
} from "canvaskit-wasm";

import { nativeColor, uIntColorToCanvasKitColor } from "../Core";

import { ShaderJS } from "./Shader";

export class MakeLinearGradientShader extends ShaderJS {
  private colors: Color[];
  private pos: number[];

  constructor(
    private readonly start: InputPoint,
    private readonly end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _flags?: number | undefined,
    _colorSpace?: ColorSpace | undefined
  ) {
    super();
    this.colors = normalizeInputColorArray(colors);
    this.pos = pos
      ? pos
      : this.colors.map((_, i) => i / (this.colors.length - 1));
  }

  paint(ctx: OffscreenCanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(
      this.start[0],
      this.start[1],
      this.end[0],
      this.end[1]
    );
    this.colors.forEach((color, i) => {
      // TODO: NativeColor should already be set
      grd.addColorStop(this.pos[i], nativeColor(color));
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas.transferToImageBitmap();
  }
}

// TODO: move to Paint/Color
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
