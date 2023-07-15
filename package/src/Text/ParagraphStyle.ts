import type { ParagraphStyle as CKParagraphStyle } from "canvaskit-wasm";

export function ParagraphStyle({
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
}: CKParagraphStyle) {
  return {
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
  };
}
