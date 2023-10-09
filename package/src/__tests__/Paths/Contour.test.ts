import type { ContourMeasure } from "canvaskit-wasm";

import "../setup";

describe("Contours", () => {
  it("Test linear (1)", async () => {
    const ranges = [0.3, 0.5, 0.7];
    const d = "M0 0 L 200 200";
    const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
    const path = CanvasKit.Path.MakeFromSVGString(d)!;

    const itRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
    const it = new CanvasKit.ContourMeasureIter(path, false, 1);

    let contourRef: ContourMeasure | null;
    let contour: ContourMeasure | null;
    while ((contourRef = itRef.next())) {
      contour = it.next()!;
      for (const t of ranges) {
        const lengthRef = contourRef.length();
        const length = contour.length();
        expect(lengthRef).toBeCloseTo(length);
        const pointsRef = contourRef.getPosTan(lengthRef * t);
        const points = contour.getPosTan(lengthRef * t);
        expect(pointsRef).toBeApproximatelyEqual(points);
      }
    }
  });

  // it("Test quadratic (1)", async () => {
  //   const ranges = [0.3, 0.5, 0.7];
  //   const d = "M 0 0 Q 0 100 100 100";
  //   const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  //   const path = CanvasKit.Path.MakeFromSVGString(d)!;

  //   const itRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  //   const it = new CanvasKit.ContourMeasureIter(path, false, 1);

  //   let contourRef: ContourMeasure | null;
  //   let contour: ContourMeasure | null;
  //   while ((contourRef = itRef.next())) {
  //     contour = it.next()!;
  //     for (const t of ranges) {
  //       const lengthRef = contourRef.length();
  //       const length = contour.length();
  //       expect(lengthRef).toBeCloseTo(length, 0.1);
  //       const pointsRef = contourRef.getPosTan(lengthRef * t);
  //       const points = contour.getPosTan(lengthRef * t);
  //       expect(pointsRef).toBeApproximatelyEqual(points);
  //     }
  //   }
  // });

  // it("Test cubic (1)", async () => {
  //   const ranges = [0.3, 0.5, 0.7];
  //   const d = "M 0 0 C 0 100 0 100 100 100";
  //   const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  //   const path = CanvasKit.Path.MakeFromSVGString(d)!;

  //   const itRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  //   const it = new CanvasKit.ContourMeasureIter(path, false, 1);

  //   let contourRef: ContourMeasure | null;
  //   let contour: ContourMeasure | null;
  //   while ((contourRef = itRef.next())) {
  //     contour = it.next()!;
  //     for (const t of ranges) {
  //       const lengthRef = contourRef.length();
  //       const length = contour.length();
  //       expect(lengthRef).toBeCloseTo(length, 0.1);
  //       const pointsRef = contourRef.getPosTan(lengthRef * t);
  //       const points = contour.getPosTan(lengthRef * t);
  //       expect(pointsRef).toBeApproximatelyEqual(points);
  //     }
  //   }
  // });

  // it("Test contour (2)", async () => {
  //   const ranges = [0.3, 0.5, 0.7];
  //   const d = "M0 0 L 100 0 L 150 50 L 200 0";
  //   const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  //   const path = CanvasKit.Path.MakeFromSVGString(d)!;

  //   const itRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  //   const it = new CanvasKit.ContourMeasureIter(path, false, 1);

  //   let contourRef: ContourMeasure | null;
  //   let contour: ContourMeasure | null;
  //   while ((contourRef = itRef.next())) {
  //     contour = it.next()!;
  //     for (const t of ranges) {
  //       const lengthRef = contourRef.length();
  //       const length = contour.length();
  //       expect(lengthRef).toBeCloseTo(length);
  //       const pointsRef = contourRef.getPosTan(lengthRef * t);
  //       const points = contour.getPosTan(lengthRef * t);
  //       expect(pointsRef).toEqual(points);
  //     }
  //   }
  //});
});
