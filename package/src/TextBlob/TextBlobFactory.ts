import type {
  TextBlobFactory as CKTextBlobFactory,
  Font,
  InputFlattenedRSXFormArray,
  InputGlyphIDArray,
  Path,
  TextBlob,
} from "canvaskit-wasm";

export const TextBlobFactory: CKTextBlobFactory = {
  MakeFromGlyphs: function (_glyphs: InputGlyphIDArray, _font: Font): TextBlob {
    throw new Error("Function not implemented.");
  },
  MakeFromRSXform: function (
    _str: string,
    _rsxforms: InputFlattenedRSXFormArray,
    _font: Font
  ): TextBlob {
    throw new Error("Function not implemented.");
  },
  MakeFromRSXformGlyphs: function (
    _glyphs: InputGlyphIDArray,
    _rsxforms: InputFlattenedRSXFormArray,
    _font: Font
  ): TextBlob {
    throw new Error("Function not implemented.");
  },
  MakeFromText: function (_str: string, _font: Font): TextBlob {
    throw new Error("Function not implemented.");
  },
  MakeOnPath: function (
    _str: string,
    _path: Path,
    _font: Font,
    _initialOffset?: number | undefined
  ): TextBlob {
    throw new Error("Function not implemented.");
  },
};
