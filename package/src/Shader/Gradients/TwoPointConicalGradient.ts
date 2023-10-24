import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { ShaderJS } from "../Shader";
import { TwoPointConicalGradient as NativeTwoPointConicalGradient } from "../../c2d";
import { nativeColor, nativePoint, normalizeInputColorArray } from "../../Core";

export class TwoPointConicalGradient extends ShaderJS {
  constructor(
    c1: InputPoint,
    r1: number,
    c2: InputPoint,
    r2: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(
      new NativeTwoPointConicalGradient(
        nativePoint(c1),
        r1,
        nativePoint(c2),
        r2,
        normalizeInputColorArray(colors).map((c) => nativeColor(c)),
        pos ?? undefined
      )
    );
  }
}
