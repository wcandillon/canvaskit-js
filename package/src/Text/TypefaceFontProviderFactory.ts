import type { TypefaceFontProviderFactory as CKTypefaceFontProviderFactory } from "canvaskit-wasm";

import { TypefaceFontProviderJS } from "./TypefaceFont";

export const TypefaceFontProviderFactory: CKTypefaceFontProviderFactory = {
  Make: () => {
    return new TypefaceFontProviderJS();
  },
};
