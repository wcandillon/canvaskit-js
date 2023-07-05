import type { ContourMeasure, ContourMeasureIter } from "canvaskit-wasm";

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

export const prepareSingleContourTest = (
  d: string
): [SingleContourTest, SingleContourTest] => {
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const path = CanvasKit.Path.MakeFromSVGString(d)!;
  const contourItRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  const contourIt = new CanvasKit.ContourMeasureIter(path, false, 1);
  return [
    new SingleContourTest(contourItRef),
    new SingleContourTest(contourIt),
  ];
};

export const singleContours: Record<
  string,
  [SingleContourTest, SingleContourTest]
> = {};
