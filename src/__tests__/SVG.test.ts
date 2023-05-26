import { processResult, setupRealSkia } from "./setup";

describe("PathKit's SVG Behavior", () => {
  it("can create a path from an SVG string", () => {
    //.This is a parallelagram from
    // https://upload.wikimedia.org/wikipedia/commons/e/e7/Simple_parallelogram.svg
    const path = CanvasKit.Path.MakeFromSVGString(
      "M 205,5 L 795,5 L 595,295 L 5,295 L 205,5 z"
    )!;
    expect(path).toBeTruthy();
    const cmds = path.toCmds();
    expect(cmds).toBeTruthy();
    // 1 move, 4 lines, 1 close
    // each element in cmds is an array, with index 0 being the verb, and the rest being args
    expect(cmds).toEqual(
      new Float32Array(
        [
          [CanvasKit.MOVE_VERB, 205, 5],
          [CanvasKit.LINE_VERB, 795, 5],
          [CanvasKit.LINE_VERB, 595, 295],
          [CanvasKit.LINE_VERB, 5, 295],
          [CanvasKit.LINE_VERB, 205, 5],
          [CanvasKit.CLOSE_VERB],
        ].flat()
      )
    );
  });

  it("can create an SVG string from a path", () => {
    const cmds = [
      [CanvasKit.MOVE_VERB, 205, 5],
      [CanvasKit.LINE_VERB, 795, 5],
      [CanvasKit.LINE_VERB, 595, 295],
      [CanvasKit.LINE_VERB, 5, 295],
      [CanvasKit.LINE_VERB, 205, 5],
      [CanvasKit.CLOSE_VERB],
    ];
    const path = CanvasKit.Path.MakeFromCmds(cmds.flat())!;
    expect(path).toBeTruthy();

    const svgStr = path.toSVGString();
    // We output it in terse form, which is different than Wikipedia's version
    expect(svgStr).toEqual("M205,5L795,5L595,295L5,295L205,5Z");
  });

  it("can create an SVG string from hex values", () => {
    const cmds = [
      [CanvasKit.MOVE_VERB, 9.37088e-26, 2.0003], // 9.37088e-26f, 2.0003f
      [CanvasKit.LINE_VERB, 795, 5],
      [CanvasKit.LINE_VERB, 595, 295],
      [CanvasKit.LINE_VERB, 5, 295],
      [CanvasKit.LINE_VERB, 9.37088e-26, 2.0003], // 9.37088e-26f, 2.0003f
      [CanvasKit.CLOSE_VERB],
    ].flat();
    const path = CanvasKit.Path.MakeFromCmds(cmds)!;
    expect(path).toBeTruthy();
    const svgStr = path.toSVGString();
    expect(svgStr).toEqual(
      "M9.37088e-26,2.0003L795,5L595,295L5,295L9.37088e-26,2.0003Z"
    );
  });

  it("should have input and the output be the same", () => {
    const testCases = ["M0,0L1075,0L1075,242L0,242L0,0Z"];

    for (const svg of testCases) {
      const path = CanvasKit.Path.MakeFromSVGString(svg)!;
      expect(path).toBeTruthy();
      const output = path.toSVGString();

      expect(svg).toEqual(output);

      path.delete();
    }
  });

  it("approximates arcs reference", () => {
    const { surface, canvas } = setupRealSkia();
    const path = new RealCanvasKit.Path();
    path.moveTo(50, 120);
    path.arc(50, 120, 45, 0, 1.75 * Math.PI);
    path.lineTo(50, 120);
    const paint = new RealCanvasKit.Paint();
    canvas.drawPath(path, paint);
    processResult(surface, "snapshots/arc.png");
  });

  // it("approximates arcs", () => {
  //   const { surface, canvas } = setupSkia();
  //   const path = new CanvasKit.Path();
  //   path.moveTo(50, 120);
  //   path.arc(50, 120, 45, 0, 1.75 * Math.PI);
  //   path.lineTo(50, 120);
  //   const paint = new CanvasKit.Paint();
  //   canvas.drawPath(path, paint);
  //   processResult(surface, "snapshots/arc.png");
  // });
});
