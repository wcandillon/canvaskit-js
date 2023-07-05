import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";
import { PathVerb } from "../../Core";
import { parseSVG } from "../../Path/SVG";

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
