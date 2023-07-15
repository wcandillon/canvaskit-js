import type { FontCollectionFactory as CKFontCollectionFactory } from "canvaskit-wasm";

import { FontCollectionJS } from "./FontCollection";

export const FontCollectionFactory: CKFontCollectionFactory = {
  Make: () => {
    return new FontCollectionJS();
  },
};
