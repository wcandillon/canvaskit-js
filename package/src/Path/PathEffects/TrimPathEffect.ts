import { saturate } from "../../math";
import { Path } from "../Path";

import type { PathEffect } from "./PathEffect";

const addSegments = (
  src: Path,
  start: number,
  stop: number,
  dst: Path,
  requiresMoveto = true
) => {
  const contours = src.getContours();
  let currentSegmentOffset = 0;
  let contourCount = 1;
  for (let i = 0; i < contours.length; i++) {
    const contour = contours[i];
    const nextOffset = currentSegmentOffset + contour.length();

    if (start < nextOffset) {
      contour.getSegment(
        start - currentSegmentOffset,
        stop - currentSegmentOffset,
        dst,
        requiresMoveto
      );

      if (stop <= nextOffset) {
        break;
      }
    }
    contourCount++;
    currentSegmentOffset = nextOffset;
  }
  return contourCount;
};

//
export class TrimPathEffect implements PathEffect {
  constructor(
    private readonly start: number,
    private readonly end: number,
    private readonly complement: boolean
  ) {}

  filterPath(path: Path): Path {
    const result = new Path();
    const length = path.length();
    const start = saturate(this.start) * length;
    const stop = saturate(this.end) * length;
    if (!this.complement) {
      if (start < stop) {
        addSegments(path, start, stop, result);
      }
    } else {
      let requiresMoveto = true;
      if (stop < length) {
        // since we're adding the "tail" first, this is the total number of contours
        const contourCount = addSegments(path, stop, length, result);

        // if the path consists of a single closed contour, we don't want to disconnect
        // the two parts with a moveto.
        if (contourCount === 1 && path.isLastContourClosed()) {
          requiresMoveto = false;
        }
      }
      if (start > 0) {
        addSegments(path, 0, start, result, requiresMoveto);
      }
    }
    return result;
  }
}
