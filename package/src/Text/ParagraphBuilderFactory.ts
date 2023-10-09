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
    style: ParagraphStyle,
    fontManager: FontMgr
  ): ParagraphBuilder {
    return new ParagraphBuilderJS(style, fontManager);
  },
  MakeFromFontProvider: function (
    style: ParagraphStyle,
    fontSrc: TypefaceFontProvider
  ) {
    return new ParagraphBuilderJS(style, fontSrc);
  },
  MakeFromFontCollection: function (
    style: ParagraphStyle,
    fontCollection: FontCollection
  ): ParagraphBuilder {
    return new ParagraphBuilderJS(style, fontCollection);
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
