import type {
  EmbindEnumEntity,
  Font,
  FontMetrics,
  InputGlyphIDArray,
  Paint,
  Typeface,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import type { TypefaceJS } from "./Typeface";

export class FontJS extends HostObject<"Font"> implements Font {
  constructor(
    readonly typeface?: TypefaceJS | null,
    readonly size?: number,
    _scaleX?: number,
    _skewX?: number
  ) {
    super("Font");
  }

  fontStyle() {
    if (this.typeface) {
      return `${this.size}px ${this.typeface.familyName}`;
    }
    return null;
  }

  getMetrics(): FontMetrics {
    throw new Error("Method not implemented.");
  }
  getGlyphBounds(
    _glyphs: InputGlyphIDArray,
    _paint?: Paint | null | undefined,
    _output?: Float32Array | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }
  getGlyphIDs(
    _str: string,
    _numCodePoints?: number | undefined,
    _output?: Uint16Array | undefined
  ): Uint16Array {
    throw new Error("Method not implemented.");
  }
  getGlyphWidths(
    _glyphs: InputGlyphIDArray,
    _paint?: Paint | null | undefined,
    _output?: Float32Array | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
  setSize(_points: number): void {
    throw new Error("Method not implemented.");
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
