import type { FontCollection, TypefaceFontProvider } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export class FontCollectionJS
  extends HostObject<"FontCollection">
  implements FontCollection
{
  fontManager: TypefaceFontProvider | null = null;

  constructor() {
    super("FontCollection");
  }
  enableFontFallback() {}
  setDefaultFontManager(fontManager: TypefaceFontProvider | null): void {
    this.fontManager = fontManager;
  }
}
