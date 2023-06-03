import type { MaskFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import type { BaseSVGFilter } from "../ImageFilter/SVG";

export abstract class MaskFilterJS
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  constructor(protected filter: BaseSVGFilter) {
    super();
  }

  abstract getFilter(): BaseSVGFilter;
}
