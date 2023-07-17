import type {
  EmbindEnumEntity,
  InputMatrix,
  InputRect,
  Shader,
  SkPicture,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import { ColorShader } from "../Shader/ColorShader";
import type { CanvasRecorder } from "../Canvas/CanvasRecorder";

export class PictureJS extends HostObject<"Picture"> implements SkPicture {
  constructor(readonly canvas: CanvasRecorder) {
    super("Picture");
  }
  makeShader(
    _tmx: EmbindEnumEntity,
    _tmy: EmbindEnumEntity,
    _mode: EmbindEnumEntity,
    _localMatrix?: InputMatrix | undefined,
    _tileRect?: InputRect | undefined
  ): Shader {
    return new ColorShader("red");
  }
  serialize(): Uint8Array | null {
    return null;
  }
}
