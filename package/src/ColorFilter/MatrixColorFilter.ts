import { makeColorMatrix } from "../SVG";

import { ColorFilterJS } from "./ColorFilter";

export class MatrixColorFilter extends ColorFilterJS {
  constructor(values: Float32Array) {
    super();
    const cf = makeColorMatrix({ type: "matrix", values });
    this._filters.push(cf);
  }
}
