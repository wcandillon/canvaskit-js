import type { ContourMeasure, ContourMeasureIter } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

import { PathJS } from "./PathJS";
import type { Contour } from "./Contour";

export class ContourMeasureJS
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
    const result = this.contour.getPosTanAtLength(distance);
    output[0] = result[0].x;
    output[1] = result[0].y;
    output[2] = result[1].x;
    output[3] = result[1].y;
    return output;
  }

  getSegment(startD: number, stopD: number, _startWithMoveTo = true) {
    const result = new PathJS();
    const contour = this.contour.getSegment(startD, stopD);
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
