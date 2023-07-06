import type { ContourMeasure, ContourMeasureIter } from "canvaskit-wasm";

export const prepareSingleContourTest = (
  d: string
): [ContourMeasure, ContourMeasure] => {
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const path = CanvasKit.Path.MakeFromSVGString(d)!;
  const contourItRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  const contourIt = new CanvasKit.ContourMeasureIter(path, false, 1);
  return [contourItRef.next()!, contourIt.next()!];
};

export const singleContours: Record<string, [ContourMeasure, ContourMeasure]> =
  {};

class ContoursMeasureTest {
  length = 0;
  contours: ContourMeasure[] = [];

  constructor(it: ContourMeasureIter) {
    let c: ContourMeasure | null = null;
    while ((c = it.next())) {
      this.length += c.length();
      this.contours.push(c);
    }
  }
}

export const multipleContours: Record<
  string,
  [ContoursMeasureTest, ContoursMeasureTest]
> = {};

export const prepareMultipleContourTest = (
  d: string
): [ContoursMeasureTest, ContoursMeasureTest] => {
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const path = CanvasKit.Path.MakeFromSVGString(d)!;
  const contourItRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  const contourIt = new CanvasKit.ContourMeasureIter(path, false, 1);
  return [
    new ContoursMeasureTest(contourItRef),
    new ContoursMeasureTest(contourIt),
  ];
};
