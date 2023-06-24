import { parseSVG } from "../Path/SVG";

describe("SVG Parser", () => {
  it("moveTo", () => {
    expect(() => parseSVG("m 10")).toThrow();
    expect(parseSVG("m 10 20")).toEqual([["m", 10, 20]]);
  });
  it("exponents", function () {
    expect(parseSVG("m 1e3 2e-3")).toEqual([["m", 1e3, 2e-3]]);
  });

  it("no whitespace between negative sign", function () {
    expect(parseSVG("M46-86")).toEqual([["M", 46, -86]]);
  });

  it("overloaded moveTo", function () {
    expect(parseSVG("m 12.5,52 39,0 0,-40 -39,0 z")).toEqual([
      ["m", 12.5, 52],
      ["l", 39, 0],
      ["l", 0, -40],
      ["l", -39, 0],
      ["z"],
    ]);
  });

  it("curveTo", function () {
    const a = parseSVG("c 50,0 50,100 100,100 50,0 50,-100 100,-100");
    const b = parseSVG("c 50,0 50,100 100,100 c 50,0 50,-100 100,-100");
    expect(a).toEqual([
      ["c", 50, 0, 50, 100, 100, 100],
      ["c", 50, 0, 50, -100, 100, -100],
    ]);
    expect(a).toEqual(b);
  });

  it("lineTo", function () {
    expect(() => parseSVG("l 10 10 0")).toThrow();
    expect(parseSVG("l 10,10")).toEqual([["l", 10, 10]]);
    expect(parseSVG("l10 10 10 10")).toEqual([
      ["l", 10, 10],
      ["l", 10, 10],
    ]);
  });

  it("horizontalTo", function () {
    expect(parseSVG("h 10.5")).toEqual([["h", 10.5]]);
  });

  it("verticalTo", function () {
    expect(parseSVG("v 10.5")).toEqual([["v", 10.5]]);
  });

  it("arcTo", function () {
    expect(parseSVG("A 30 50 0 0 1 162.55 162.45")).toEqual([
      ["A", 30, 50, 0, 0, 1, 162.55, 162.45],
    ]);
  });

  it("quadratic curveTo", function () {
    expect(parseSVG("M10 80 Q 95 10 180 80")).toEqual([
      ["M", 10, 80],
      ["Q", 95, 10, 180, 80],
    ]);
  });

  it("smooth curveTo", function () {
    expect(parseSVG("S 1 2, 3 4")).toEqual([["S", 1, 2, 3, 4]]);
  });

  it("smooth quadratic curveTo", function () {
    expect(() => parseSVG("t 1 2 3")).toThrow();
    expect(parseSVG("T 1 -2e2")).toEqual([["T", 1, -2e2]]);
  });

  it("close", function () {
    expect(parseSVG("z")).toEqual([["z"]]);
  });
});
