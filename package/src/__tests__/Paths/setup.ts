import type { ContourMeasure } from "canvaskit-wasm";

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
