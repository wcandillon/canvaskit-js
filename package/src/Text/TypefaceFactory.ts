import type {
  TypefaceFactory as CKTypeFaceFactory,
  Typeface,
} from "canvaskit-wasm";

import { TypefaceJS } from "./Typeface";
import { loadFont } from "./TypefaceFont";

export const TypefaceFactory: CKTypeFaceFactory = {
  MakeFreeTypeFaceFromData(fontData: ArrayBuffer): Typeface {
    const name = loadFont(fontData);
    return new TypefaceJS(name, fontData);
  },
};
