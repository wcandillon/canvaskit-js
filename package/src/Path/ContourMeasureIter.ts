import type { Path } from "./Path";

export class ContourMeasure {
  constructor() {}

  getPosTan(
    _distance: number,
    output: Float32Array = new Float32Array(4)
  ): Float32Array {
    return output;
  }
  getSegment(
    _startD: number,
    _stopD: number,
    _dst: Path,
    _startWithMoveTo: boolean
  ) {
    throw new Error("Method not implemented.");
  }
  isClosed(): boolean {
    return false;
  }
  length(): number {
    return 0;
  }
}

export class ContourMeasureIter {
  private index = 0;
  private contours: ContourMeasure[] = [];

  constructor(path: Path, _forceClosed: boolean, _resScale = 1) {
    this.contours = new Array(path.countContours()).map(
      (_) => new ContourMeasure()
    );
  }

  next(): ContourMeasure | null {
    return this.contours[this.index++] ?? null;
  }
}
