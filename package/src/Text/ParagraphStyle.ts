import type {
  ParagraphStyle as CKParagraphStyle,
  TextStyle as CKTextStyle,
  TextStyle,
} from "canvaskit-wasm";

export function TextStyle(style: CKTextStyle) {
  return style;
}

export const ParagraphStyle = (style: CKParagraphStyle) => {
  return style;
};
