import type { TypefaceFontProvider } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { postScriptName } from "./fontMetadata";

export const loadFont = (data: ArrayBuffer, familynameAlias?: string) => {
  const familyName = familynameAlias ?? postScriptName(data);
  const font = new FontFace(familyName, data);
  font.load();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.fonts.add(font);
  return familyName;
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
