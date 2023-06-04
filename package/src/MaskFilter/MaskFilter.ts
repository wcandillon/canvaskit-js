import type { MaskFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import type { SVGFilter } from "../ImageFilter/SVG";

export abstract class MaskFilterJS
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  protected filters: SVGFilter[] = [];

  constructor() {
    super();
  }

  getFilter() {
    return this.filters;
  }
}
