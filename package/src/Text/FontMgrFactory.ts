import type { FontMgrFactory as CKFontMgrFactory } from "canvaskit-wasm";

import { loadFont } from "./loadFont";
import { FontMgrJS } from "./FontMgr";

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
