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

interface TextRenderingData {
  nativeStyle: Partial<CanvasTextDrawingStyles>;
  metrics: TextMetrics;
}

export interface Token extends TextRenderingData {
  text: string;
  style: StyleNode;
  x: number;
  y: number;
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
  layout(width: number): void {
    let x = 0;
    let y = 0;
    let lineHeight = 0;

    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i];
      if (x + token.metrics.width > width) {
        x = 0;
        y += lineHeight;
        lineHeight = 0;
      }

      token.x = x;
      token.y = y;

      x += token.metrics.width;
      lineHeight = Math.max(
        lineHeight,
        token.metrics.actualBoundingBoxAscent +
          token.metrics.actualBoundingBoxDescent
      );
    }
  }
  unresolvedCodepoints(): number[] {
    throw new Error("Method not implemented.");
  }

  drawParagraph(
    ctx: CanvasRenderingContext2D,
    offsetX: number,
    offsetY: number
  ) {
    for (const token of this.tokens) {
      const { text, x, y } = token;
      const {
        nativeStyle: { font },
      } = token;
      if (font) {
        ctx.font = font;
      }
      ctx.fillText(text, x + offsetX, y + offsetY);
    }
  }
}
