import type { ContourMeasure } from "canvaskit-wasm";

import "../setup";

describe("Contours", () => {
  it("Test contour (1)", async () => {
    const ranges = [
      [0, 50],
      [50, 100],
    ];
    const d = "M0 0 L 50 50 L 100 0 L 150 50 L 200 0";
    const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
    const path = CanvasKit.Path.MakeFromSVGString(d)!;

    const itRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
    const it = new CanvasKit.ContourMeasureIter(path, false, 1);

    let contourRef: ContourMeasure | null;
    let contour: ContourMeasure | null;
    while ((contourRef = itRef.next())) {
      contour = it.next()!;
      for (const [] of ranges) {
        const lengthRef = contourRef.length();
        const length = contour.length();
        expect(lengthRef).toBeCloseTo(length);
        const pointsRef = contourRef.getPosTan(lengthRef * 0.5);
        const points = contour.getPosTan(length * 0.5);
        expect(pointsRef).toEqual(points);
      }
    }
  });
});
