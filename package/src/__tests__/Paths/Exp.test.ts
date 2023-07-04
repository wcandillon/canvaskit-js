// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../jest.d.ts" />

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

describe("Path Trim", () => {
  it("simple triming test (1)", () => {
    const d = "M0 0 L 50 50 L 100 0 L 150 50 L 200 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.25, 0.75, false);
    const result = pe.filterPath(path).toCmds();
    const ref = [
      PathVerb.Move,
      50,
      50,
      PathVerb.Line,
      100,
      0,
      PathVerb.Line,
      150,
      50,
    ];
    expect(result).toEqual(ref);
  });
  // it("Trim a quadratic curves", () => {
  //   testTriming("M 0 0 Q 0 100 100 100");
  // });
  // it("Trim a cubic curves", () => {
  //   testTriming("M 0 0 C 0 100 0 0 100 100");
  // });
});
