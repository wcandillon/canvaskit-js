import { ColorShader as NativeColorShader } from "../c2d";

import { ShaderJS } from "./Shader";

export class ColorShader extends ShaderJS {
  constructor(color: string) {
    super(new NativeColorShader(color));
  }
}
