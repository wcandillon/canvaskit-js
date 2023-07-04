/* eslint-disable prefer-destructuring */
import type { ContourMeasure, ContourMeasureIter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { PathJS } from "./PathJS";
import type { Contour } from "./Contour";

class ContourMeasureJS
  extends HostObject<"ContourMeasure">
  implements ContourMeasure
{
  constructor(
    private readonly contour: Contour,
    _forceClosed: boolean,
    _resScale: number
  ) {
    super("ContourMeasure");
  }

  getPosTan(distance: number, output = new Float32Array(4)) {
    const length = this.length();
    const pos = this.contour.getPointAt(distance / length);
    output[0] = pos[0];
    output[1] = pos[1];
    return output;
  }

  getSegment(startD: number, stopD: number, _startWithMoveTo = true) {
    const result = new PathJS();
    const length = this.length();
    const contour = this.contour.getSegment(startD / length, stopD / length);
    result.getPath().contours.push(contour);
    return result;
  }

  isClosed() {
    return this.contour.closed;
  }

  length() {
    return this.contour.length();
  }
}

export class ContourMeasureIterJS
  extends HostObject<"ContourMeasureIter">
  implements ContourMeasureIter
{
  private index = 0;

  constructor(
    private readonly path: PathJS,
    private readonly forceClosed: boolean,
    private readonly resScale: number
  ) {
    super("ContourMeasureIter");
  }

  next() {
    const { path, forceClosed, resScale } = this;
    const contour = path.getPath().contours[this.index++];
    if (!contour) {
      return null;
    }
    return new ContourMeasureJS(contour, forceClosed, resScale);
  }
}
