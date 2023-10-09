import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";
import { parseSVG } from "../../Path/SVG";
import { PathVerb } from "../../Core";

describe("Path Trim", () => {
  it("simple triming test (1)", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0, 0.75, false);
    const result = pe.filterPath(path).toCmds();
    expect(result).toBeTruthy();
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
    expect(result).toBeTruthy();
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
    expect(result).toBeTruthy();
    const ref = [PathVerb.Move, 20 * 0.66, 0, PathVerb.Line, 0.9 * 20, 0];
    expect(result).toBeApproximatelyEqual(ref, 0.1);
  });
  it("simple triming test (4)", () => {
    const d = "M0 0 L 10 0 L 20 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.66, 1, false);
    const result = pe.filterPath(path).toCmds();
    expect(result).toBeTruthy();
    const ref = [PathVerb.Move, 20 * 0.66, 0, PathVerb.Line, 20, 0];
    expect(result).toBeApproximatelyEqual(ref, 0.1);
  });
  it("simple triming test (5)", () => {
    const d = "M0 0 L 50 50 L 100 0 L 150 50 L 200 0";
    const path = parseSVG(d)!.getPath();
    const pe = new TrimPathEffect(0.25, 0.75, false);
    const result = pe.filterPath(path).toCmds();
    expect(result).toBeTruthy();
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
});
