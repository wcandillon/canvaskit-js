import type { TypefaceFontProvider } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { parseFontTable } from "./Parser";

export const loadFont = (data: ArrayBuffer, familynameAlias?: string) => {
  const familyName =
    familynameAlias ??
    (parseFontTable(data).namesTable.postScriptName.en as string);
  const font = new FontFace(familyName, data);
  font.load();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.fonts.add(font);
  return { familyName, font };
};

export class TypefaceFontProviderJS
  extends HostObject<"TypefaceFontProvider">
  implements TypefaceFontProvider
{
  constructor() {
    super("TypefaceFontProvider");
  }

  registerFont(bytes: Uint8Array | ArrayBuffer, family: string): void {
    loadFont(bytes, family);
  }
}
