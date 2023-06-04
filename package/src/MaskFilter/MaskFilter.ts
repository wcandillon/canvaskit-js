import type { MaskFilter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";
import type { SVGFilter } from "../ImageFilter/SVG";
import { svgCtx } from "../ImageFilter/SVG";

export abstract class MaskFilterJS
  extends HostObject<MaskFilter>
  implements MaskFilter
{
  private static id = 0;

  protected filters: SVGFilter[] = [];
  private url: string;

  constructor() {
    super();
    this.url = `filter-${MaskFilterJS.id}`;
    MaskFilterJS.id++;
  }

  create() {
    svgCtx.create(this.url, this.filters);
  }

  dispose() {
    svgCtx.dispose();
  }

  getFilter(): string {
    return `url(#${this.url})`;
  }
}
