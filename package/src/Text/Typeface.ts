import type { Typeface } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class TypefaceJS extends HostObject<"Typeface"> implements Typeface {
  constructor(readonly familyName: string) {
    super("Typeface");
  }

  getGlyphIDs(
    _str: string,
    _numCodePoints?: number | undefined,
    _output?: Uint16Array | undefined
  ): Uint16Array {
    throw new Error("Method not implemented.");
  }
}
