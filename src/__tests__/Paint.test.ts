//import { CanvasKitLite } from "../CanvasKitLite";

import { processResult, setupSkia } from "./setup";

//const CanvasKit = new CanvasKitLite();

describe("Paint", () => {
  it("should draw a paint", () => {
    const { surface, htmlCanvas } = setupSkia();
    const canvas = surface.getCanvas();
    const paint = new CanvasKitLite.Paint();
    paint.setColor(CanvasKitLite.RED);
    canvas.drawPaint(paint);
    console.log(htmlCanvas.toDataURL());
    processResult(surface, "snapshots/red.png");
  });
});
