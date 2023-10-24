import { IndexedHostObject } from "../Constants";
import type { SVGFilter } from "../SVG";
import { makeBlur } from "../SVG";

export class ImageFilter extends IndexedHostObject {
  constructor(protected _filters: SVGFilter[] = []) {
    super("image-filter");
  }

  addFilter(filter: SVGFilter) {
    this._filters.push(filter);
  }

  get filters() {
    return this._filters;
  }
}

export class BlurImageFilter extends ImageFilter {
  constructor(
    readonly sigmaX: number,
    readonly sigmaY: number,
    readonly input: ImageFilter | null = null
  ) {
    super();
    const blur = makeBlur(sigmaX, sigmaY);
    this._filters.push(blur);
    if (input) {
      this._filters.push(...input.filters);
    }
  }
}
