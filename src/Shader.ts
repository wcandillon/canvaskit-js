import type {
  Color,
  InputFlexibleColorArray,
  InputPoint,
  Shader,
} from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { SkiaRenderingContext } from "./Values";
import { NativeColor, uIntColorToCanvasKitColor } from "./Values";

export abstract class ShaderLite extends HostObject<Shader> implements Shader {
  abstract toGradient(ctx: SkiaRenderingContext): CanvasGradient;
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

export class LinearGradientLite extends ShaderLite {
  private positions: number[];
  private colors: Color[];

  constructor(
    private start: InputPoint,
    private end: InputPoint,
    colors: InputFlexibleColorArray,
    positions?: number[] | null
  ) {
    super();
    this.colors = normalizeInputColorArray(colors);
    this.positions =
      positions ?? this.colors.map((_, i) => i / (this.colors.length - 1));
  }

  toGradient(ctx: CanvasRenderingContext2D) {
    const { start, end, colors, positions } = this;
    const grd = ctx.createLinearGradient(start[0], start[1], end[0], end[1]);
    positions.forEach((pos, i) => {
      grd.addColorStop(pos, NativeColor(colors[i]));
    });
    return grd;
  }
}
