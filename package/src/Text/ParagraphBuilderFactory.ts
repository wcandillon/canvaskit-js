import type {
  ParagraphBuilderFactory as CKParagraphBuilderFactory,
  FontBlock,
  FontCollection,
  FontMgr,
  ParagraphBuilder,
  ParagraphStyle,
  ShapedLine,
  TypefaceFontProvider,
} from "canvaskit-wasm";

import { ParagraphBuilderJS } from "./ParagraphBuilder";

export const ParagraphBuilderFactory: CKParagraphBuilderFactory = {
  Make: function (
    _style: ParagraphStyle,
    _fontManager: FontMgr
  ): ParagraphBuilder {
    throw new Error("Function not implemented.");
  },
  MakeFromFontProvider: function (
    style: ParagraphStyle,
    fontSrc: TypefaceFontProvider
  ) {
    return new ParagraphBuilderJS(style, fontSrc);
  },
  MakeFromFontCollection: function (
    _style: ParagraphStyle,
    _fontCollection: FontCollection
  ): ParagraphBuilder {
    throw new Error("Function not implemented.");
  },
  ShapeText: function (
    _text: string,
    _runs: FontBlock[],
    _width?: number | undefined
  ): ShapedLine[] {
    throw new Error("Function not implemented.");
  },
  RequiresClientICU: function () {
    return false;
  },
};
