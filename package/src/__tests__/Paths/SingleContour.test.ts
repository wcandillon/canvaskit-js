import type { ContourMeasure, ContourMeasureIter } from "canvaskit-wasm";

import "../setup";

class SingleContourTest {
  private contour: ContourMeasure;

  constructor(contourIt: ContourMeasureIter) {
    this.contour = contourIt.next()!;
  }

  getTotalLength() {
    return this.contour.length();
  }

  getPosTan(length: number) {
    return this.contour.getPosTan(length);
  }
}

const prepareSingleContourTest = (d: string) => {
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const path = CanvasKit.Path.MakeFromSVGString(d)!;
  const contourItRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  const contourIt = new CanvasKit.ContourMeasureIter(path, false, 1);
  return {
    reference: new SingleContourTest(contourItRef),
    test: new SingleContourTest(contourIt),
  };
};

describe("Single contour values", () => {
  const paths = [
    "M0 0 L200 200",
    "M 640.48 1285.21 Q 642.39 644.73 642.39 644.73",
    "M 267 0 Q 382 0 512 0",
    "M 267 0 Q 383 265 512 0",
    "M0 0 Q 0 200 200 200",
    "M200 200 C 275 100 575 100 500 200",
    "M0 0 C 0 200 0 200 200 200",
  ];
  test.each(paths)("Check path length: %s", (d: string) => {
    const { reference, test } = prepareSingleContourTest(d);
    const length = reference.getTotalLength();
    expect(length).toBeApproximatelyEqual(test.getTotalLength(), 3);
  });
});
