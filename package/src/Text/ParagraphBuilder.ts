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

class ParagraphNode {
  private text = "";

  child: ParagraphNode | null = null;

  constructor(
    readonly parent: ParagraphNode | null,
    private readonly textStyle: TextStyle,
    private fg?: Paint,
    private bg?: Paint
  ) {}

  addText(str: string) {
    this.text += str;
  }
}

export class ParagraphBuilderJS
  extends HostObject<"ParagraphBuilder">
  implements ParagraphBuilder
{
  private root: ParagraphNode;
  private current: ParagraphNode;
  private text = "";

  constructor(
    private readonly style: ParagraphStyle,
    _fontSrc: TypefaceFontProvider
  ) {
    super("ParagraphBuilder");
    this.root = new ParagraphNode(null, style.textStyle ?? {});
    this.current = this.root;
  }

  addText(str: string): void {
    this.current.addText(str);
    this.text += str;
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
    return this.text;
  }
  pop(): void {
    if (this.current.parent) {
      this.current = this.current.parent;
    } else {
      throw new Error("Cannot pop root node");
    }
  }
  pushStyle(textStyle: TextStyle): void {
    const child = new ParagraphNode(this.current, textStyle);
    this.current.child = child;
    this.current = child;
  }
  pushPaintStyle(textStyle: TextStyle, fg: Paint, bg: Paint): void {
    const child = new ParagraphNode(this.current, textStyle, fg, bg);
    this.current.child = child;
    this.current = child;
  }
  reset(): void {
    this.root = new ParagraphNode(null, {});
    this.current = this.root;
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
