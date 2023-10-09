import type { TypefaceFontProvider } from "canvaskit-wasm";

import { parseFontTable } from "./Parser";
import { FontMgrJS } from "./FontMgr";

export const loadFont = (data: ArrayBuffer, familynameAlias?: string) => {
  const familyName =
    familynameAlias ??
    (parseFontTable(data).namesTable.postScriptName.en as string);
  const font = new FontFace(familyName, data);
  font.load();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.fonts.add(font);
  return { familyName };
};

export class TypefaceFontProviderJS
  extends FontMgrJS
  implements TypefaceFontProvider
{
  constructor() {
    super([]);
  }

  registerFont(bytes: Uint8Array | ArrayBuffer, family: string): void {
    loadFont(bytes, family);
  }
}
