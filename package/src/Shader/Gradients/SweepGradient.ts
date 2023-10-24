import type { InputFlexibleColorArray, InputPoint } from "canvaskit-wasm";

import { ShaderJS } from "../Shader";
import { SweepGradient as NativeSweepGradient } from "../../c2d";
import { nativeColor, nativePoint, normalizeInputColorArray } from "../../Core";

export class SweepGradient extends ShaderJS {
  constructor(
    c: InputPoint,
    startAngle: number,
    colors: InputFlexibleColorArray,
    pos: number[] | null
  ) {
    super(
      new NativeSweepGradient(
        nativePoint(c),
        startAngle,
        normalizeInputColorArray(colors).map((cl) => nativeColor(cl)),
        pos ?? undefined
      )
    );
  }
}
