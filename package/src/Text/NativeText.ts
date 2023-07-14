import type { InputGlyphIDArray } from "canvaskit-wasm";

import { normalizeArray } from "../Core";

const offscreen = new OffscreenCanvas(1, 1);
export const TextContext = offscreen.getContext("2d")!;

export const glyphArray = (input: InputGlyphIDArray) => {
  return normalizeArray(input, Uint16Array);
};

export const glyphToText = (glyphs: Uint16Array) => {
  return String.fromCodePoint(...glyphs);
};
