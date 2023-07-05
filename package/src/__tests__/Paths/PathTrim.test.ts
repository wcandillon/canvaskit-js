import { diff } from "jest-diff";

import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";
import { PathVerb } from "../../Core";
import { parseSVG } from "../../Path/SVG";

const testTriming = (d: string) => {
  const ranges = [
    [0, 0.25],
    [0, 0.33],
    [0, 0.5],
    [0, 0.66],
    [0, 0.75],
    [0.25, 0.75],
    [0.33, 0.66],
    [0.66, 1],
  ];
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const parsed = parseSVG(d)!;
  expect(parsed).toBeTruthy();
  const pathTest = parsed.getPath();
  expect(pathRef).toBeTruthy();
  for (const complement of [false]) {
    for (const range of ranges) {
      const [start, end] = range;
      const path1 = pathRef.copy().trim(start, end, complement)!;
      const pe = new TrimPathEffect(start, end, complement);
      const path2 = pe.filterPath(pathTest);

      const cmds1 = Array.from(path1.toCmds());
      const cmds2 = path2.toCmds();
      try {
        expect(cmds1).toBeApproximatelyEqual(cmds2, 0.1);
      } catch (error) {
        // console.log("Reference:");
        // console.log(JSON.stringify(cmds1, null, 2));
        // console.log("Result:");
        //console.log(JSON.stringify(path1.toSVGString(), null, 2));
        //console.log(JSON.stringify(path2.toSVGString(), null, 2));
        const diffString = diff(cmds1, cmds2);
        throw new Error(`Failed at (${start}, ${end}) with path d = ${d} (complement=${complement}):
${diffString}`);
      }
    }
  }
};

describe("Path Trim", () => {
  it("simple triming test (1)", () => {
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
  it("simple triming test (2)", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.25, 0.75, false);
    const result = pe.filterPath(path).toCmds();
    const ref = [
      PathVerb.Move,
      5,
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
  it("simple triming test (3)", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.66, 0.9, false);
    const result = pe.filterPath(path).toCmds();
    const ref = [PathVerb.Move, 20 * 0.66, 0, PathVerb.Line, 0.9 * 20, 0];
    expect(result).toBeApproximatelyEqual(ref, 0.1);
  });
  it("simple triming test (4)", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.66, 1, false);
    const result = pe.filterPath(path).toCmds();
    const ref = [PathVerb.Move, 20 * 0.66, 0, PathVerb.Line, 20, 0];
    expect(result).toBeApproximatelyEqual(ref, 0.1);
  });
  it("simple triming test (5)", () => {
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
  it("Trim lines", () => {
    testTriming("M0 0 L 100 100");
    testTriming("M0 0 L 1 1");
    testTriming("M0 0 L 10 0 L 20 0");
    testTriming("M0 0 L 50 50 L 100 0");
    testTriming("M0 0 L 40 50 L 100 0 L 150 50 L 200 0");
  });
  // it("Trim a quadratic curves", () => {
  //   testTriming("M 0 0 Q 0 100 100 100");
  // });
  // it("Trim a cubic curves", () => {
  //   testTriming("M 0 0 C 0 100 0 0 100 100");
  // });
});
