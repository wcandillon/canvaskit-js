import type {
  EmbindEnumEntity,
  Font,
  FontMetrics,
  InputGlyphIDArray,
  Paint,
  Typeface,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { TypefaceJS } from "./Typeface";
import { TextContext, glyphArray } from "./NativeText";

export class FontJS extends HostObject<"Font"> implements Font {
  private typeface: TypefaceJS;

  constructor(
    typeface?: TypefaceJS | null,
    private fontSize = 14,
    _scaleX?: number,
    _skewX?: number
  ) {
    super("Font");
    this.typeface = typeface ?? new TypefaceJS("sans-serif", null);
  }

  fontStyle() {
    return `${this.fontSize}px ${this.typeface.familyName}`;
  }

  getMetrics(): FontMetrics {
    TextContext.font = this.fontStyle();
    // Using a capital 'H' to approximate ascent, as it generally extends to the highest point in most fonts.
    const ascent = TextContext.measureText("H").actualBoundingBoxAscent;
    // Using a lowercase 'p' to approximate descent, as it generally extends to the lowest point in most fonts.
    const descent = TextContext.measureText("p").actualBoundingBoxDescent;
    // Approximating leading by using 1.2 times font size - font size
    const lineHeight = this.fontSize * 1.2;
    const leading = lineHeight - this.fontSize;
    return {
      ascent: -ascent,
      descent: descent,
      leading: leading,
    };
  }
  getGlyphBounds(
    inputGlyphs: InputGlyphIDArray,
    _paint?: Paint | null | undefined,
    output?: Float32Array | undefined
  ) {
    const glyphs = glyphArray(inputGlyphs);
    const result = output ?? new Float32Array(glyphs.length * 4);
    const text = this.typeface.glyphToText(glyphs);
    for (let i = 0; i < text.length; i++) {
      TextContext.font = this.fontStyle();
      const metrics = TextContext.measureText(text[i]);
      result[i * 4 + 0] = -metrics.actualBoundingBoxLeft;
      result[i * 4 + 1] = -metrics.actualBoundingBoxAscent;
      result[i * 4 + 2] = metrics.actualBoundingBoxRight;
      result[i * 4 + 3] = metrics.actualBoundingBoxDescent;
    }
    return result;
  }
  getStringForGlyph(glyphID: number) {
    return this.typeface.getStringForGlyph(glyphID);
  }
  getGlyphIDs(str: string, numCodePoints?: number, output?: Uint16Array) {
    return this.typeface.getGlyphIDs(str, numCodePoints, output);
  }
  getGlyphWidths(
    inputGlyphs: InputGlyphIDArray,
    paint?: Paint | null | undefined,
    output?: Float32Array | undefined
  ) {
    return this.getGlyphBounds(inputGlyphs, paint, output);
  }
  getGlyphIntercepts(
    _glyphs: InputGlyphIDArray,
    _positions: Float32Array | number[],
    _top: number,
    _bottom: number
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  getScaleX(): number {
    throw new Error("Method not implemented.");
  }
  getSize(): number {
    return this.fontSize;
  }
  getSkewX(): number {
    throw new Error("Method not implemented.");
  }
  isEmbolden(): boolean {
    throw new Error("Method not implemented.");
  }
  getTypeface(): Typeface | null {
    throw new Error("Method not implemented.");
  }
  setEdging(_edging: EmbindEnumEntity): void {
    throw new Error("Method not implemented.");
  }
  setEmbeddedBitmaps(_embeddedBitmaps: boolean): void {
    throw new Error("Method not implemented.");
  }
  setHinting(_hinting: EmbindEnumEntity): void {
    throw new Error("Method not implemented.");
  }
  setLinearMetrics(_linearMetrics: boolean): void {
    throw new Error("Method not implemented.");
  }
  setScaleX(_sx: number): void {
    throw new Error("Method not implemented.");
  }
  setSize(points: number): void {
    this.fontSize = points;
  }
  setSkewX(_sx: number): void {
    throw new Error("Method not implemented.");
  }
  setEmbolden(_embolden: boolean): void {
    throw new Error("Method not implemented.");
  }
  setSubpixel(_subpixel: boolean): void {
    throw new Error("Method not implemented.");
  }
  setTypeface(_face: Typeface | null): void {
    throw new Error("Method not implemented.");
  }
}
