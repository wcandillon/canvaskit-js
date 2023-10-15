import { IndexedHostObject } from "../Constants";
import type { SVGFilter } from "../SVG";
import { makeBlur } from "../SVG";

export abstract class ImageFilter extends IndexedHostObject {
  protected _filters: SVGFilter[] = [];

  constructor() {
    super("image-filter");
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
