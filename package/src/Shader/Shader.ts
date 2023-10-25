import type { Shader } from "canvaskit-wasm";

import type { Shader as NativeShader } from "../c2d";
import { HostObject } from "../HostObject";

export class ShaderJS extends HostObject<"Shader"> implements Shader {
  constructor(private _shader: NativeShader) {
    super("Shader");
  }

  getShader() {
    return this._shader;
  }
}
