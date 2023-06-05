import type { ColorFilterJS } from "../ColorFilter/ColorFilter";
import type { ImageFilterJS } from "../ImageFilter";
import type { MaskFilterJS } from "../MaskFilter/MaskFilter";
import { svgCtx } from "../SVG";

export class SVGPaintFilter {
  private static count = 0;

  public readonly id: string;
  public readonly filter: SVGElement[];

  constructor(filter: SVGElement[]) {
    this.id = `filter-${SVGPaintFilter.count}`;
    SVGPaintFilter.count++;
    this.filter = filter;
    this.create();
  }

  create() {
    svgCtx.create(this.id, this.filter);
  }

  dispose() {
    svgCtx.disposeFilter(this.id);
  }

  getFilter(): string {
    return `url(#${this.id})`;
  }

  copy() {
    return new SVGPaintFilter(
      this.filter.map((f) => f.cloneNode(true) as SVGElement)
    );
  }

  static makeFromFilter(
    filter: ImageFilterJS | MaskFilterJS | ColorFilterJS
  ): SVGPaintFilter {
    return new SVGPaintFilter(filter.getFilters());
  }
}
