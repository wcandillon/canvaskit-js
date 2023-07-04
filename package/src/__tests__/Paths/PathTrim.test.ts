import { parseSVG } from "../../Path";
import { TrimPathEffect } from "../../Path/PathEffects";
import "../setup";

describe("Path Trim", () => {
  it("Trim a line", () => {
    const path = RealCanvasKit.Path.MakeFromSVGString("M0 0 L 100 100")!;
    path.trim(0, 0.5, false);
    let path2 = parseSVG("M0 0 L 100 100")!.getPath();
    const pe = new TrimPathEffect(0, 0.5, false);
    path2 = pe.filterPath(path2);
    expect(path).toBeTruthy();
    expect(Array.from(path.toCmds())).toEqual(path2.toCmds());
  });
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
