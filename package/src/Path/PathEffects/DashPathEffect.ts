import { Path } from "../../c2d";

import type { PathEffect } from "./PathEffect";

export class DashPathEffect implements PathEffect {
  constructor(
    private readonly on: number,
    private readonly off: number,
    private readonly phase: number
  ) {}

  filterPath(path: Path): Path {
    const dashedPath = new Path();
    const dashCycleLength = this.on + this.off;

    path.contours.forEach((contour) => {
      const contourLength = contour.length();
      let currentPos = (this.phase % dashCycleLength) - dashCycleLength;

      while (currentPos < contourLength) {
        const dashStart = currentPos + this.off;
        let dashEnd = dashStart + this.on;

        // Ensure dashStart and dashEnd are within the contour
        if (dashStart < contourLength) {
          dashEnd = Math.min(dashEnd, contourLength);

          // Add the dash segment to the dashed path
          const dashSegment = contour.getSegment(dashStart, dashEnd);
          dashedPath.contours.push(dashSegment);
        }

        currentPos += dashCycleLength;
      }
    });

    return dashedPath;
  }
}
