import type { Typeface } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { parseFontTable } from "./Parser";
import type { ICMap } from "./Parser/opentype/cmap";

export class TypefaceJS extends HostObject<"Typeface"> implements Typeface {
  cmap: ICMap | null = null;

  constructor(readonly familyName: string, data: ArrayBuffer | null) {
    super("Typeface");
    if (data) {
      this.cmap = parseFontTable(data).cmap;
    }
  }

  // TODO: refactor so we don't need to create a typed array here
  getStringForGlyph(glyphID: number) {
    return this.glyphToText(Uint16Array.of(glyphID));
  }

  glyphToText(glyphs: Uint16Array) {
    let text = "";
    const keys = Object.keys(this.cmap!.glyphIndexMap!);
    const values = Object.values(this.cmap!.glyphIndexMap!);
    for (let i = 0; i < glyphs.length; i++) {
      const index = values.indexOf(glyphs[i]);
      if (index !== -1) {
        text += String.fromCodePoint(Number(keys[index]));
      }
    }
    return text;
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
