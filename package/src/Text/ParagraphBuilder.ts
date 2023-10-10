import type {
  EmbindEnumEntity,
  FontCollection,
  FontMgr,
  InputGraphemes,
  InputLineBreaks,
  InputWords,
  Paint,
  ParagraphBuilder,
  ParagraphStyle,
  TextStyle,
  TypefaceFontProvider,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import {
  TextAlignEnum,
  TextBaselineEnum,
  TextDirectionEnum,
} from "../Core/Constants";

import { ParagraphJS, type StyleNode, type Token } from "./Paragraph";
import { TextContext } from "./NativeText";
import type { ParagraphStyleJS, TextStyleJS } from "./ParagraphStyle";
import { defaultParagraphStyle, defaultTextStyle } from "./ParagraphStyle";

interface TextNode {
  style: StyleNode;
  text: string;
}

// https://github.com/google/skia/blob/main/site/docs/dev/design/text_shaper.md
// https://github.com/google/skia/blob/main/site/docs/dev/design/text_overview.md
// https://github.com/google/skia/blob/main/site/docs/dev/design/text_c2d.md

export class ParagraphBuilderJS
  extends HostObject<"ParagraphBuilder">
  implements ParagraphBuilder
{
  private readonly pStyle: ParagraphStyleJS;
  private stack: StyleNode[];
  private nodes: TextNode[];
  private text: string;

  constructor(
    paraStyle: ParagraphStyle,
    _fontSrc: TypefaceFontProvider | FontMgr | FontCollection
  ) {
    super("ParagraphBuilder");
    this.pStyle = defaultParagraphStyle(paraStyle);
    const textStyle = defaultTextStyle(this.pStyle.textStyle ?? {});
    const style = { textStyle };
    this.stack = [style];
    this.nodes = [{ style, text: "" }];
    this.text = "";
  }

  get current() {
    return this.nodes[this.nodes.length - 1];
  }

  addText(str: string) {
    this.current.text += str;
  }

  build() {
    const tokens: Token[] = [];
    const segmenter = Intl.Segmenter
      ? new Intl.Segmenter("en", { granularity: "word" })
      : { segment: () => [] };
    for (const node of this.nodes) {
      const segments = segmenter.segment(node.text);
      for (const segment of segments) {
        tokens.push({
          text: segment.segment,
          style: node.style,
          ...getTextData(this.pStyle, node.style.textStyle, segment.segment),
          x: 0,
          y: 0,
        });
      }
    }
    return new ParagraphJS(this.pStyle, tokens);
  }
  setWordsUtf8(_words: InputWords): void {
    throw new Error("Method not implemented.");
  }
  setWordsUtf16(_words: InputWords): void {
    throw new Error("Method not implemented.");
  }
  setGraphemeBreaksUtf8(_graphemes: InputGraphemes): void {
    throw new Error("Method not implemented.");
  }
  setGraphemeBreaksUtf16(_graphemes: InputGraphemes): void {
    throw new Error("Method not implemented.");
  }
  setLineBreaksUtf8(_lineBreaks: InputLineBreaks): void {
    throw new Error("Method not implemented.");
  }
  setLineBreaksUtf16(_lineBreaks: InputLineBreaks): void {
    throw new Error("Method not implemented.");
  }
  getText() {
    return this.text;
  }
  pop() {
    if (this.stack.length === 0) {
      throw new Error("Cannot pop from empty stack");
    }
    this.stack.pop();
  }

  pushStyle(textStyle: TextStyle) {
    const style = { textStyle: defaultTextStyle(textStyle) };
    this.stack.push(style);
    this.nodes.push({ style, text: "" });
  }

  pushPaintStyle(textStyle: TextStyle, fg: Paint, bg: Paint) {
    const style = { textStyle: defaultTextStyle(textStyle), fg, bg };
    this.stack.push(style);
    this.nodes.push({ style, text: "" });
  }

  reset() {
    const textStyle = this.pStyle.textStyle ?? {};
    const style = { textStyle };
    this.stack = [style];
    this.nodes = [{ style, text: "" }];
    this.text = "";
  }

  addPlaceholder(
    _width?: number | undefined,
    _height?: number | undefined,
    _alignment?: EmbindEnumEntity | undefined,
    _baseline?: EmbindEnumEntity | undefined,
    _offset?: number | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
}

const computeNativeStyle = (
  pStyle: ParagraphStyleJS,
  style: TextStyleJS
): CanvasTextDrawingStyles => {
  const fontFamilies = style.fontFamilies
    ? style.fontFamilies?.join()
    : "sans-serif";
  const font = `${style.fontSize}px ${fontFamilies}`;
  const textAlign = _textAlign(pStyle.textAlign);
  const direction = _direction(pStyle.textDirection);
  const textBaseline = _textBaseLine(style.textBaseline);
  return {
    font,
    textAlign,
    direction,
    textBaseline,
    fontKerning: "auto",
  };
};

const _textBaseLine = (baseline: EmbindEnumEntity) => {
  if (baseline.value === TextBaselineEnum.Alphabetic) {
    return "alphabetic";
  } else {
    return "ideographic";
  }
};

const _textAlign = (align: EmbindEnumEntity) => {
  if (align.value === TextAlignEnum.Right) {
    return "right";
  } else if (align.value === TextAlignEnum.Center) {
    return "center";
  } else if (align.value === TextAlignEnum.Start) {
    return "start";
  } else if (align.value === TextAlignEnum.End) {
    return "end";
  } else {
    return "left";
  }
};

const _direction = (dir: EmbindEnumEntity) => {
  if (dir.value === TextDirectionEnum.RTL) {
    return "rtl";
  }
  return "ltr";
};

const getTextData = (
  pStyle: ParagraphStyleJS,
  style: TextStyleJS,
  text: string
): { nativeStyle: CanvasTextDrawingStyles; metrics: TextMetrics } => {
  const nativeStyle = computeNativeStyle(pStyle, style);
  TextContext.font = nativeStyle.font;
  TextContext.textAlign = nativeStyle.textAlign;
  TextContext.direction = nativeStyle.direction;
  TextContext.textBaseline = nativeStyle.textBaseline;
  const metrics = TextContext.measureText(text);
  return { metrics, nativeStyle };
};
