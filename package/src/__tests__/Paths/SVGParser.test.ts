import { parseSVG } from "../../Path/SVG";
import "../setup";

describe("SVG Parser", () => {
  it("How does CanvasKit handles contour less paths?", () => {
    const path = RealCanvasKit.Path.MakeFromSVGString(
      "c 50,0 50,100 100,100 50,0 50,-100 100,-100"
    )!;
    const path2 = parseSVG(
      "c 50,0 50,100 100,100 50,0 50,-100 100,-100"
    ).getPath();
    expect(path).toBeTruthy();
    expect(Array.from(path.toCmds())).toEqual(path2.toCmds());
  });
  it("moveTo", () => {
    expect(() => parseSVG("m 10")).toThrow();
    const path = parseSVG("m 10 20").getPath();
    expect(path.toSVGString()).toEqual("");
    const path2 = parseSVG("m 10 20 l 0 10").getPath();
    expect(path2.toSVGString()).toEqual("M10 20 L10 30");
  });

  it("exponents", function () {
    const path = parseSVG("m 1e3 2e-3 l 0 0").getPath();
    const [verb, x, y] = path.toCmds();
    expect(verb).toEqual(CanvasKit.MOVE_VERB);
    expect(x).toEqual(1e3);
    expect(y).toBeCloseTo(2e-3);
  });

  it("no whitespace between negative sign", function () {
    const path = parseSVG("M46-86 l 0 0").getPath();
    const [verb, x, y] = path.toCmds();
    expect(verb).toEqual(CanvasKit.MOVE_VERB);
    expect(x).toEqual(46);
    expect(y).toBeCloseTo(-86);
  });

  it("overloaded moveTo", function () {
    const path = parseSVG("m 12.5,52 39,0 0,-40 -39,0 z").getPath();
    expect(path.toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 12.5, 52],
        [CanvasKit.LINE_VERB, 12.5 + 39, 52],
        [CanvasKit.LINE_VERB, 12.5 + 39, 52 - 40],
        [CanvasKit.LINE_VERB, 12.5, 52 - 40],
        [CanvasKit.CLOSE_VERB],
      ].flat()
    );
  });

  it("curveTo", function () {
    const a = parseSVG("c 50,0 50,100 100,100 50,0 50,-100 100,-100")
      .getPath()
      .toSVGString();
    const b = parseSVG("c 50,0 50,100 100,100 c 50,0 50,-100 100,-100")
      .getPath()
      .toSVGString();
    expect(a).toEqual("M0 0 C50 0 50 100 100 100 C150 100 150 0 200 0");
    expect(a).toEqual(b);
  });

  it("lineTo", function () {
    expect(() => parseSVG("l 10 10 0")).toThrow();
    expect(parseSVG("l 10,10").getPath().toCmds()).toEqual([
      CanvasKit.MOVE_VERB,
      0,
      0,
      CanvasKit.LINE_VERB,
      10,
      10,
    ]);
    expect(parseSVG("l10 10 10 10").getPath().toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 0, 0],
        [CanvasKit.LINE_VERB, 10, 10],
        [CanvasKit.LINE_VERB, 20, 20],
      ].flat()
    );
  });

  it("horizontalTo", function () {
    expect(parseSVG("h 10.5").getPath().toCmds()).toEqual([
      CanvasKit.MOVE_VERB,
      0,
      0,
      CanvasKit.LINE_VERB,
      10.5,
      0,
    ]);
  });

  it("verticalTo", function () {
    expect(parseSVG("v 10.5").getPath().toCmds()).toEqual([
      CanvasKit.MOVE_VERB,
      0,
      0,
      CanvasKit.LINE_VERB,
      0,
      10.5,
    ]);
  });

  it("arcTo", function () {
    const cmd1 = parseSVG("M 0 0 A 30 50 0 0 1 162.55 162.45")
      .getPath()
      .toCmds();
    const cmd2 = parseSVG(
      // eslint-disable-next-line max-len
      "M0 0 C26.915597915649414 -74.81156921386719 85.12305450439453 -99.09265899658203 130.00999450683594 -54.233333587646484 C174.89694213867188 -9.374004364013672 189.46559143066406 87.638427734375 162.5500030517578 162.4499969482422"
    )
      .getPath()
      .toCmds();
    expect(cmd1).toBeApproximatelyEqual(cmd2);
  });

  it("quadratic curveTo", function () {
    expect(parseSVG("M10 80 Q 95 10 180 80").getPath().toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 10, 80],
        [CanvasKit.QUAD_VERB, 95, 10, 180, 80],
      ].flat()
    );
  });

  it("smooth curveTo (1)", function () {
    expect(parseSVG("S 1 2, 3 4").getPath().toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 0, 0],
        [CanvasKit.CUBIC_VERB, 0, 0, 1, 2, 3, 4],
      ].flat()
    );
  });

  it("smooth curveTo (2)", function () {
    expect(parseSVG("M 0, 0 S 1 2, 3 4").getPath().toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 0, 0, CanvasKit.CUBIC_VERB, 0, 0, 1, 2, 3, 4],
      ].flat()
    );
  });

  it("smooth curveTo (3)", function () {
    expect(
      parseSVG("M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
        .getPath()
        .toCmds()
    ).toEqual(
      [
        [
          CanvasKit.MOVE_VERB,
          10,
          80,
          CanvasKit.CUBIC_VERB,
          40,
          10,
          65,
          10,
          95,
          80,
          CanvasKit.CUBIC_VERB,
          65,
          10,
          150,
          150,
          180,
          80,
        ],
      ].flat()
    );
  });

  // it("smooth quadratic curveTo", function () {
  //   expect(() => parseSVG("t 1 2 3")).toThrow();
  //   const cmds = parseSVG("M 0 0 T 10, 10, 1 -2e2").getPath().toCmds();
  //   console.log(cmds);
  //   expect(cmds[3]).toEqual(CanvasKit.QUAD_VERB);
  //   expect(cmds[4]).toEqual(0);
  //   expect(cmds[5]).toEqual(0);
  //   expect(cmds[4]).toEqual(10);
  //   expect(cmds[5]).toEqual(10);
  //   expect(cmds[3]).toEqual(CanvasKit.QUAD_VERB);
  //   expect(cmds[4]).toEqual(0);
  //   expect(cmds[5]).toEqual(0);
  //   expect(cmds[8]).toEqual(1);
  //   expect(cmds[9]).toBeCloseTo(-200);
  // });

  it("close (1)", function () {
    expect(parseSVG("z").getPath().toCmds()).toEqual([]);
  });

  it("close (2)", function () {
    const path = parseSVG("M 0 0 L 10 10 z").getPath();
    expect(path.toSVGString()).toEqual("M0 0 L10 10 Z");
    expect(path.toCmds()).toEqual([
      CanvasKit.MOVE_VERB,
      0,
      0,
      CanvasKit.LINE_VERB,
      10,
      10,
      CanvasKit.CLOSE_VERB,
    ]);
  });
});
