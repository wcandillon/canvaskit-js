import type {
  EmbindEnumEntity,
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

import { ParagraphJS, type StyleNode, type Token } from "./Paragraph";
import { TextContext } from "./NativeText";

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
  private stack: StyleNode[];
  private nodes: TextNode[];
  private text: string;

  constructor(
    private readonly pStyle: ParagraphStyle,
    _fontSrc: TypefaceFontProvider
  ) {
    super("ParagraphBuilder");
    const textStyle = this.pStyle.textStyle ?? {};
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
    for (const node of this.nodes) {
      const segmenter = new Intl.Segmenter("en", { granularity: "word" });
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
    const style = { textStyle };
    this.stack.push(style);
    this.nodes.push({ style, text: "" });
  }

  pushPaintStyle(textStyle: TextStyle, fg: Paint, bg: Paint) {
    const style = { textStyle, fg, bg };
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

const computeNativeStyle = (pStyle: ParagraphStyle, style: TextStyle) => {
  const fontFamilies = style.fontFamilies
    ? pStyle.textStyle?.fontFamilies?.join()
    : "sans-serif";
  const size = style.fontSize ? pStyle.textStyle?.fontSize : 14;
  const font = `${size}px ${fontFamilies}`;
  // TODO: add enum for text align
  //const align = pStyle.textAlign ?? "left";
  // TODO: add enum for text direction
  //const direction = pStyle.textDirection ?? "ltr";
  return {
    font,
  };
};

const getTextData = (
  pStyle: ParagraphStyle,
  style: TextStyle,
  text: string
): { nativeStyle: Partial<CanvasTextDrawingStyles>; metrics: TextMetrics } => {
  const nativeStyle = computeNativeStyle(pStyle, style);
  TextContext.font = nativeStyle.font;
  const metrics = TextContext.measureText(text);
  return { metrics, nativeStyle };
};
