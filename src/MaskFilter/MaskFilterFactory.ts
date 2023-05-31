import type {
  MaskFilterFactory as CKMaskFilterFactory,
  EmbindEnumEntity,
  MaskFilter,
} from "canvaskit-wasm";

import { BlurMaskFilter } from "./BlurMaskFilter";

export const MaskFilterFactory: CKMaskFilterFactory = {
  MakeBlur: function (
    style: EmbindEnumEntity,
    sigma: number,
    _respectCTM: boolean
  ): MaskFilter {
    return new BlurMaskFilter(style.value, sigma);
  },
};
