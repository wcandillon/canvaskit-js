import type { FontMgrFactory as CKFontMgrFactory } from "canvaskit-wasm";

import { FontMgrJS } from "./FontMgr";
import { loadFont } from "./TypefaceFont";

export const FontMgrFactory: CKFontMgrFactory = {
  FromData(...buffers: ArrayBuffer[]) {
    const familyNames: string[] = [];
    buffers.forEach((buffer) => {
      const familyName = loadFont(buffer);
      familyNames.push(familyName);
    });
    return new FontMgrJS(familyNames);
  },
};
