import type {
  RuntimeEffectFactory as IRuntimeEffectFactory,
  RuntimeEffect,
  Shader,
  TracedShader,
} from "canvaskit-wasm";

import { WebGLContext } from "../c2d";

import { RuntimeEffectJS } from "./RuntimeEffect";

export const RuntimeEffectFactory: IRuntimeEffectFactory = {
  Make(
    sksl: string,
    callback?: ((err: string) => void) | undefined
  ): RuntimeEffect | null {
    return new RuntimeEffectJS(new WebGLContext(sksl, false, callback));
  },
  MakeTraced(
    _shader: Shader,
    _traceCoordX: number,
    _traceCoordY: number
  ): TracedShader {
    throw new Error("Method not implemented.");
  },
};
