import type {
  Color,
  ColorSpace,
  EmbindEnumEntity,
  InputFlexibleColorArray,
  InputMatrix,
  InputPoint,
} from "canvaskit-wasm";

import { NativeColor, uIntColorToCanvasKitColor } from "../Values";

import { ShaderJS } from "./Shader";

export class MakeLinearGradientShader extends ShaderJS {
  private canvas = new OffscreenCanvas(0, 0);
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

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const grd = ctx.createLinearGradient(
      this.start[0],
      this.start[1],
      this.end[0],
      this.end[1]
    );
    this.colors.forEach((color, i) => {
      // TODO: NativeColor should already be set
      grd.addColorStop(this.pos[i], NativeColor(color));
    });
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
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
