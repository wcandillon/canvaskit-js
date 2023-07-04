import { saturate } from "../../math";
import { Path } from "../Path";

import type { PathEffect } from "./PathEffect";

export class TrimPathEffect implements PathEffect {
  constructor(
    private readonly start: number,
    private readonly end: number,
    _complement: boolean
  ) {}

  filterPath(path: Path): Path {
    const trimmedPath = new Path();
    const totalLength = path.length();
    const startT = saturate(this.start);
    const stopT = saturate(this.end);
    const start = startT * totalLength;
    const stop = stopT * totalLength;
    if (start >= stop) {
      return trimmedPath;
    }
    let offset = 0;
    path.contours.forEach((contour) => {
      const contourLength = contour.length();
      const nextOffset = offset + contourLength;
      if (nextOffset <= start || offset >= stop) {
        offset = nextOffset;
        return;
      }
      const t0 = Math.max(0, (start - offset) / contourLength);
      const t1 = Math.min(1, (stop - offset) / contourLength);
      //console.log(`contour.getSegment(${t0}, ${t1});`);
      const partialContour = contour.getSegment(t0, t1);
      trimmedPath.contours.push(partialContour);
      offset = nextOffset;
    });
    return trimmedPath;
  }
}
