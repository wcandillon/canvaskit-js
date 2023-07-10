import type {
  EmbindEnumEntity,
  LineMetrics,
  Paint,
  Paragraph,
  PositionWithAffinity,
  RectWithDirection,
  ShapedLine,
  TextStyle,
  URange,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export interface StyleNode {
  textStyle: TextStyle;
  fg?: Paint;
  bg?: Paint;
}

export interface Token {
  text: string;
  style: StyleNode;
  metrics: TextMetrics;
}

export class ParagraphJS extends HostObject<"Paragraph"> implements Paragraph {
  constructor(readonly tokens: Token[]) {
    super("Paragraph");
  }
  didExceedMaxLines(): boolean {
    throw new Error("Method not implemented.");
  }
  getAlphabeticBaseline(): number {
    throw new Error("Method not implemented.");
  }
  getGlyphPositionAtCoordinate(_dx: number, _dy: number): PositionWithAffinity {
    throw new Error("Method not implemented.");
  }
  getHeight(): number {
    throw new Error("Method not implemented.");
  }
  getIdeographicBaseline(): number {
    throw new Error("Method not implemented.");
  }
  getLineMetrics(): LineMetrics[] {
    throw new Error("Method not implemented.");
  }
  getLongestLine(): number {
    throw new Error("Method not implemented.");
  }
  getMaxIntrinsicWidth(): number {
    throw new Error("Method not implemented.");
  }
  getMaxWidth(): number {
    throw new Error("Method not implemented.");
  }
  getMinIntrinsicWidth(): number {
    throw new Error("Method not implemented.");
  }
  getRectsForPlaceholders(): RectWithDirection[] {
    throw new Error("Method not implemented.");
  }
  getRectsForRange(
    _start: number,
    _end: number,
    _hStyle: EmbindEnumEntity,
    _wStyle: EmbindEnumEntity
  ): RectWithDirection[] {
    throw new Error("Method not implemented.");
  }
  getWordBoundary(_offset: number): URange {
    throw new Error("Method not implemented.");
  }
  getShapedLines(): ShapedLine[] {
    throw new Error("Method not implemented.");
  }
  layout(_width: number): void {
    throw new Error("Method not implemented.");
  }
  unresolvedCodepoints(): number[] {
    throw new Error("Method not implemented.");
  }
}
