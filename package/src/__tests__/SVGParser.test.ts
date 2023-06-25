import { parseSVG } from "../Path/SVGParser";

import "./setup";

describe("SVG Parser", () => {
  it("moveTo", () => {
    expect(() => parseSVG("m 10")).toThrow();
    const path = parseSVG("m 10 20").getPath();
    expect(path.toSVGString()).toEqual("M10 20");
  });
  it("exponents", function () {
    const path = parseSVG("m 1e3 2e-3").getPath();
    const [verb, x, y] = path.toCmds();
    expect(verb).toEqual(CanvasKit.MOVE_VERB);
    expect(x).toEqual(1e3);
    expect(y).toBeCloseTo(2e-3);
  });

  it("no whitespace between negative sign", function () {
    const path = parseSVG("M46-86").getPath();
    const [verb, x, y] = path.toCmds();
    expect(verb).toEqual(CanvasKit.MOVE_VERB);
    expect(x).toEqual(46);
    expect(y).toBeCloseTo(-86);
  });

  // it("overloaded moveTo", function () {
  //   const { path } = parseSVG("m 12.5,52 39,0 0,-40 -39,0 z");
  //   console.log(path.toCmds());
  //   console.log(path.toSVGString());
  //   expect(path.toCmds()).toEqual(
  //     [
  //       [CanvasKit.MOVE_VERB, 12.5, 52],
  //       [CanvasKit.LINE_VERB, 12.5 + 39, 0],
  //       [CanvasKit.LINE_VERB, 12.5 + 39, 52 - 40],
  //       [CanvasKit.LINE_VERB, 12.5, 52 - 40],
  //       [CanvasKit.CLOSE_VERB],
  //     ].flat()
  //   );
  // });

  // it("curveTo", function () {
  //   const a = parseSVG(
  //     "c 50,0 50,100 100,100 50,0 50,-100 100,-100"
  //   ).path.toSVGString();
  //   const b = parseSVG(
  //     "c 50,0 50,100 100,100 c 50,0 50,-100 100,-100"
  //   ).path.toSVGString();
  //   expect(a).toEqual("C50,0 50,100 100,100 C150,100 150,0 200,0");
  //   expect(a).toEqual(b);
  // });

  it("lineTo", function () {
    expect(() => parseSVG("l 10 10 0")).toThrow();
    expect(parseSVG("l 10,10").getPath().toCmds()).toEqual([
      CanvasKit.LINE_VERB,
      10,
      10,
    ]);
    expect(parseSVG("l10 10 10 10").getPath().toCmds()).toEqual(
      [
        [CanvasKit.LINE_VERB, 10, 10],
        [CanvasKit.LINE_VERB, 20, 20],
      ].flat()
    );
  });

  it("horizontalTo", function () {
    expect(parseSVG("h 10.5").getPath().toCmds()).toEqual([
      CanvasKit.LINE_VERB,
      10.5,
      0,
    ]);
  });

  it("verticalTo", function () {
    expect(parseSVG("v 10.5").getPath().toCmds()).toEqual([
      CanvasKit.LINE_VERB,
      0,
      10.5,
    ]);
  });

  // it("arcTo", function () {
  //   expect(parseSVG("A 30 50 0 0 1 162.55 162.45")).toEqual([
  //     ["A", 30, 50, 0, 0, 1, 162.55, 162.45],
  //   ]);
  // });

  it("quadratic curveTo", function () {
    expect(parseSVG("M10 80 Q 95 10 180 80").getPath().toCmds()).toEqual(
      [
        [CanvasKit.MOVE_VERB, 10, 80],
        [CanvasKit.QUAD_VERB, 95, 10, 180, 80],
      ].flat()
    );
  });

  // it("smooth curveTo (1)", function () {
  //   expect(parseSVG("S 1 2, 3 4").path.toCmds()).toEqual(
  //     [
  //       [CanvasKit.MOVE_VERB, 0, 0, CanvasKit.CUBIC_VERB, 0, 0, 1, 2, 3, 4],
  //     ].flat()
  //   );
  // });

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
  //   expect(parseSVG("T 1 -2e2")).toEqual([["T", 1, -2e2]]);
  // });

  it("close (1)", function () {
    expect(parseSVG("z").getPath().toCmds()).toEqual([]);
  });

  it("close (2)", function () {
    const path = parseSVG("M 0 0 L 10 10 z").getPath();
    //expect(path.toSVGString()).toEqual("M0 0 L10 10 Z");
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
