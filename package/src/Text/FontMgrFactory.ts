import type { FontMgrFactory as CKFontMgrFactory } from "canvaskit-wasm";

import { FontMgrJS } from "./FontMgr";
import { TypefaceFactory } from "./TypefaceFactory";
import type { TypefaceJS } from "./Typeface";

export const FontMgrFactory: CKFontMgrFactory = {
  FromData(...buffers: ArrayBuffer[]) {
    const typefaces: TypefaceJS[] = [];
    buffers.forEach((buffer) => {
      const typeface = TypefaceFactory.MakeFreeTypeFaceFromData(buffer);
      if (!typeface) {
        throw new Error("Could not load font");
      }
      typefaces.push(typeface as TypefaceJS);
    });
    return new FontMgrJS(typefaces);
  },
};
