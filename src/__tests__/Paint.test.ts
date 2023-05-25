//import { CanvasKitLite } from "../CanvasKitLite";

import { processResult, setupSkia } from "./setup";

//const CanvasKit = new CanvasKitLite();

describe("Paint", () => {
  it("should draw a paint", () => {
    const { surface } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKitLite.Paint();
    paint.setColor(CanvasKitLite.RED);
    canvas.drawPaint(paint);
    processResult(surface, "snapshots/red.png");
  });

  it("should draw a circle", () => {
    const { surface, width, height } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKitLite.Paint();
    paint.setColor(CanvasKitLite.CYAN);
    canvas.drawCircle(width / 2, height / 2, width / 2, paint);
    processResult(surface, "snapshots/circle.png");
  });
});
