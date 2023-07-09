import type {
  TypefaceFactory as CKTypeFaceFactory,
  Typeface,
} from "canvaskit-wasm";

import { loadFont } from "./loadFont";
import { TypefaceJS } from "./Typeface";

export const TypefaceFactory: CKTypeFaceFactory = {
  MakeFreeTypeFaceFromData(fontData: ArrayBuffer): Typeface {
    const name = loadFont(fontData);
    return new TypefaceJS(name);
  },
};
