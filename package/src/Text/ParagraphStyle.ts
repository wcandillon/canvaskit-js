import type {
  ParagraphStyle as CKParagraphStyle,
  StrutStyle,
  TextAlign,
  TextDirection,
  TextHeightBehavior,
  TextStyle,
} from "canvaskit-wasm";

export class ParagraphStyle implements CKParagraphStyle {
  disableHinting?: boolean;
  ellipsis?: string;
  heightMultiplier?: number;
  maxLines?: number;
  replaceTabCharacters?: boolean;
  strutStyle?: StrutStyle;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  textHeightBehavior?: TextHeightBehavior;
  textStyle?: TextStyle;

  constructor({
    disableHinting,
    ellipsis,
    heightMultiplier,
    maxLines,
    replaceTabCharacters,
    strutStyle,
    textAlign,
    textDirection,
    textHeightBehavior,
    textStyle,
  }: ParagraphStyle) {
    this.disableHinting = disableHinting;
    this.ellipsis = ellipsis;
    this.heightMultiplier = heightMultiplier;
    this.maxLines = maxLines;
    this.replaceTabCharacters = replaceTabCharacters;
    this.strutStyle = strutStyle;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.textHeightBehavior = textHeightBehavior;
    this.textStyle = textStyle;
  }
}
