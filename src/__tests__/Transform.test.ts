import { processResult, setupSkia } from "./setup";

const paint = new CanvasKit.Paint();
paint.setColor(CanvasKit.CYAN);

describe("Shapes", () => {
  it("should rotate on a pivot point", () => {
    const { surface, center, width, height, canvas } = setupSkia();
    canvas.save();
    canvas.rotate(45, center[0], center[1]);
    canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
    canvas.restore();
    processResult(surface, "snapshots/rotate.png");
  });

  it("should respect a pivot point", () => {
    const { surface, center, width, height, canvas } = setupSkia();
    canvas.save();
    canvas.translate(center[0], center[1]);
    canvas.rotate(45, 0, 0);
    canvas.translate(-center[0], -center[1]);
    canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
    canvas.restore();
    processResult(surface, "snapshots/rotate.png");
  });
});
