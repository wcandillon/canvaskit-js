import { ColorMatrixFilter } from "../SVG";

import { ColorFilterJS } from "./ColorFilter";

export class MatrixColorFilter extends ColorFilterJS {
  constructor(values: Float32Array) {
    super();
    const cf = new ColorMatrixFilter({ type: "matrix", values });
    this.filters.push(cf);
  }
}
