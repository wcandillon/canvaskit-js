import type {
  EmbindEnumEntity,
  InputMatrix,
  InputRect,
  Shader,
  SkPicture,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
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
    throw new Error("Method not implemented.");
  }
  serialize(): Uint8Array | null {
    throw new Error("Method not implemented.");
  }
}
