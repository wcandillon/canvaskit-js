import type { Typeface } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { parseFontTable } from "./Parser";
import type { ICMap } from "./Parser/opentype/cmap";

export class TypefaceJS extends HostObject<"Typeface"> implements Typeface {
  cmap: ICMap | null = null;

  constructor(
    readonly familyName: string,
    readonly fontFace: FontFace | null,
    data: ArrayBuffer | null
  ) {
    super("Typeface");
    if (data) {
      this.cmap = parseFontTable(data).cmap;
    }
  }

  getGlyphIDs(str: string, numCodePoints?: number, output?: Uint16Array) {
    const result = output ?? new Uint16Array(numCodePoints ?? str.length);
    for (let i = 0; i < result.length; i++) {
      const codepoint = str.codePointAt(i)!;
      const index = this.cmap?.glyphIndexMap![codepoint] ?? 0;
      result[i] = index;
    }
    return result;
  }
}
