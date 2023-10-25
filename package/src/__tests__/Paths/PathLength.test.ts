import type { ContourMeasure, Path } from "canvaskit-wasm";

import { vec } from "../../c2d";
import { PathBuilder } from "../../Path/PathBuilder";

import "../setup";

const totalLength = (path: Path, close = false) => {
  let length = 0;
  const iter = new RealCanvasKit.ContourMeasureIter(path, close, 1);
  let contour: ContourMeasure | null;
  while ((contour = iter.next())) {
    length += contour.length();
  }
  return length;
};

describe("Path Length", () => {
  it("Simply linear path (1)", () => {
    const pathRef = new RealCanvasKit.Path();
    pathRef.moveTo(0, 0);
    pathRef.lineTo(100, 0);
    const lengthRef = totalLength(pathRef);
    const path = new PathBuilder().moveTo(vec(0, 0)).lineTo(vec(100, 0));
    expect(lengthRef).toBe(path.getPath().length());

    pathRef.lineTo(100, 0);
    pathRef.close();

    path.lineTo(vec(100, 0));
    path.close();
    expect(path.getPath().length()).toBe(totalLength(pathRef, true));
  });
  it("Simply linear path (2)", () => {
    const path = new PathBuilder().moveTo(vec(0, 0)).lineTo(vec(100, 100));
    expect(path.getPath().length()).toBe(Math.hypot(100, 100));
    path.lineTo(vec(100, 0));
    path.close();
    expect(path.getPath().length()).toBe(Math.hypot(100, 100) + 100 + 100);
  });

  it("Quadratic curve path (2)", () => {
    const pathRef = new RealCanvasKit.Path();
    pathRef.moveTo(0, 0);
    pathRef.quadTo(50, 100, 100, 0);
    const lengthRef = totalLength(pathRef);

    const path = new PathBuilder()
      .moveTo(vec(0, 0))
      .quadraticCurveTo(vec(50, 100), vec(100, 0));

    expect(path.getPath().length()).toBeCloseTo(lengthRef, 0);
  });

  it("Cubic curve path (2)", () => {
    const pathRef = new RealCanvasKit.Path();
    pathRef.moveTo(0, 0);
    pathRef.cubicTo(33, 100, 66, 100, 100, 0);
    const lengthRef = totalLength(pathRef);

    const path = new PathBuilder()
      .moveTo(vec(0, 0))
      .cubicCurveTo(vec(33, 100), vec(66, 100), vec(100, 0));

    expect(path.getPath().length()).toBeCloseTo(lengthRef, 0);
  });
  // it("Rounded rectangle path", () => {
  //     const path = new PathBuilder().addRoundedRect(
  //       {x: 0, y: 0, width: 200, height: 100},
  // eslint-disable-next-line max-len
  //       {topLeft: Float32Array.of(50, 50), topRight: Float32Array.of(50, 50), bottomRight: Float32Array.of(50, 50), bottomLeft: Float32Array.of(50, 50)}
  //     );
  //     // The length would be 2 * (width + height - 4 * r) + 2 * pi * r
  //     expect(path.getPath().length()).toBeCloseTo(2 * (200 + 100 - 4 * 50) + 2 * Math.PI * 50);
  //   });

  // it("Circular path", () => {
  //     const path = new PathBuilder().addOval({x: 0, y: 0, width: 100, height: 100});
  //     // The length of a circle's circumference is 2 * pi * r
  //     expect(path.getPath().length()).toBeCloseTo(2 * Math.PI * 50);
  //   });
});
