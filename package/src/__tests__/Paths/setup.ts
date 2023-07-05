import type { ContourMeasure, ContourMeasureIter, Path } from "canvaskit-wasm";

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

class ContoursMeasure {
  private len = 0;

  constructor(it: ContourMeasureIter) {
    let c: ContourMeasure | null = null;
    while ((c = it.next())) {
      this.len += c.length();
    }
  }

  getPosTan(
    _distance: number,
    _output?: Float32Array | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
  }

  getSegment(_startD: number, _stopD: number, _startWithMoveTo: boolean): Path {
    throw new Error("Method not implemented.");
  }

  isClosed() {
    return false;
  }

  length(): number {
    return this.len;
  }
}

export const multipleContours: Record<
  string,
  [ContoursMeasure, ContoursMeasure]
> = {};

export const prepareMultipleContourTest = (
  d: string
): [ContoursMeasure, ContoursMeasure] => {
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const path = CanvasKit.Path.MakeFromSVGString(d)!;
  const contourItRef = new RealCanvasKit.ContourMeasureIter(pathRef, false, 1);
  const contourIt = new CanvasKit.ContourMeasureIter(path, false, 1);
  return [new ContoursMeasure(contourItRef), new ContoursMeasure(contourIt)];
};
