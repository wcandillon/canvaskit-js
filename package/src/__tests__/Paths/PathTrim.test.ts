/// <reference path="../jest.d.ts" />
import { diff } from "jest-diff";

import { parseSVG } from "../../Path";
import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";
import { PathVerb } from "../../Core";

expect.extend({
  toBeApproximatelyEqual(received, argument, tolerance) {
    if (received.length !== argument.length) {
      return { pass: false, message: () => "Arrays have different lengths" };
    }
    for (let i = 0; i < received.length; i++) {
      if (Math.abs(received[i] - argument[i]) > tolerance) {
        return {
          pass: false,
          message: () => `Element at index ${i} differ more than tolerance`,
        };
      }
    }
    return { pass: true, message: () => "Arrays are approximately equal" };
  },
});

const testTriming = (d: string) => {
  const ts = [0.66]; //[0.25, 0.33, 0.5, 0.66, 0.75];
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const parsed = parseSVG(d)!;
  expect(parsed).toBeTruthy();
  const pathTest = parsed.getPath();
  expect(pathRef).toBeTruthy();
  for (const complement of [false]) {
    for (const t of ts) {
      const path1 = pathRef.copy().trim(0, t, complement)!;
      const pe = new TrimPathEffect(0, t, complement);
      const path2 = pe.filterPath(pathTest);

      const cmds1 = Array.from(path1.toCmds());
      const cmds2 = path2.toCmds();
      try {
        expect(cmds1).toBeApproximatelyEqual(cmds2, 0.1);
      } catch (error) {
        const diffString = diff(cmds1, cmds2);
        throw new Error(`Failed at t = ${t} with path d = ${d} (complement=${complement}):
${diffString}`);
      }
    }
  }
};

describe("Path Trim", () => {
  it("Isolated triming test", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0, 0.75, false);
    const result = pe.filterPath(path).toCmds();
    const ref = [
      PathVerb.Move,
      0,
      0,
      PathVerb.Line,
      10,
      0,
      PathVerb.Line,
      15,
      0,
    ];
    expect(result).toEqual(ref);
  });
  it("Trim lines", () => {
    testTriming("M0 0 L 100 100");
    testTriming("M0 0 L 1 1");
    testTriming("M0 0 L 10 0 L 20 0");
    testTriming("M0 0 L 50 50 L 100 0");
    testTriming("M0 0 L 50 50 L 100 0 L 150 50 L 200 0");
  });
  //   it("Trim a quadratic curves", () => {
  //     testTriming("M 0 0 Q 0 100 100 100");
  //   });
  //   it("Trim a cubic curve", () => {
  //     const path = RealCanvasKit.Path.MakeFromSVGString(
  //       "M0 0c 50,0 50,100 100,100 50,0 50,-100 100,-100"
  //     )!;
  //     path.trim(0, 0.5, false);
  //     const path2 = parseSVG(
  //       "M0 0c 50,0 50,100 100,100 50,0 50,-100 100,-100"
  //     )!.getPath();
  //     const pe = new TrimPathEffect(0, 0.5, false);
  //     pe.filterPath(path2);
  //     expect(path).toBeTruthy();
  //     expect(Array.from(path.toCmds())).toEqual(path2.toCmds());
  //   });
});
