import { parseSVG } from "../../Path";
import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";

const testTriming = (d: string) => {
  const ts = [0.25, 0.33, 0.5, 0.66, 0.75];
  const pathRef = RealCanvasKit.Path.MakeFromSVGString(d)!;
  const parsed = parseSVG(d)!;
  expect(parsed).toBeTruthy();
  const pathTest = parsed.getPath();
  expect(pathRef).toBeTruthy();
  for (const complement of [false, true]) {
    for (const t of ts) {
      const path1 = pathRef.copy().trim(0, t, complement)!;
      const pe = new TrimPathEffect(0, t, complement);
      const path2 = pe.filterPath(pathTest);
      try {
        expect(Array.from(path1.toCmds())).toEqual(path2.toCmds());
      } catch (error) {
        throw new Error(
          `Failed at t = ${t} with path d = ${d} (complement = ${complement})`
        );
      }
    }
  }
};

describe("Path Trim", () => {
  it("Trim lines", () => {
    testTriming("M0 0 L 100 100");
    testTriming("M0 0 L 1 1");
    testTriming("M0 0 L 50 50 L 100 0");
    // testTriming("M0 0 L 50 50 L 100 0 L 150 50 L 200 0");
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
