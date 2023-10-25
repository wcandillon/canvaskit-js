import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { ShaderJS } from "../Shader";
import { LinearGradient as NativeLinearGradient } from "../../c2d";
import { nativeColor, nativePoint, normalizeInputColorArray } from "../../Core";

export class LinearGradient extends ShaderJS {
  constructor(
    start: InputPoint,
    end: InputPoint,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(
      new NativeLinearGradient(
        nativePoint(start),
        nativePoint(end),
        normalizeInputColorArray(colors).map((c) => nativeColor(c)),
        pos ?? undefined
      )
    );
  }
}
