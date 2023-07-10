import type {
  EmbindEnumEntity,
  InputGraphemes,
  InputLineBreaks,
  InputWords,
  Paint,
  Paragraph,
  ParagraphBuilder,
  ParagraphStyle,
  TextStyle,
  TypefaceFontProvider,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

interface StyleNode {
  textStyle: TextStyle;
  fg?: Paint;
  bg?: Paint;
}

interface TextNode {
  style: StyleNode;
  text: string;
}

export class ParagraphBuilderJS
  extends HostObject<"ParagraphBuilder">
  implements ParagraphBuilder
{
  private stack: StyleNode[];
  private nodes: TextNode[];

  constructor(
    private readonly pStyle: ParagraphStyle,
    _fontSrc: TypefaceFontProvider
  ) {
    super("ParagraphBuilder");
    const textStyle = this.pStyle.textStyle ?? {};
    const style = { textStyle };
    this.stack = [style];
    this.nodes = [{ style, text: "" }];
  }

  get current() {
    return this.nodes[this.nodes.length - 1];
  }

  addText(str: string) {
    this.current.text += str;
  }

  build(): Paragraph {
    throw new Error("Method not implemented.");
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
  getText(): string {
    throw new Error("Method not implemented.");
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
