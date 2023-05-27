import { checkImage, skia } from "./setup";

describe("Transforms", () => {
  it("should rotate on a pivot point", async () => {
    const image = await skia.eval(
      ({ CanvasKit, width, height, canvas, center }) => {
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.CYAN);
        canvas.save();
        canvas.rotate(45, center.x, center.y);
        canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/rotate.png");
  });

  it("should respect a pivot point", async () => {
    const image = await skia.eval(
      ({ CanvasKit, width, height, canvas, center }) => {
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.CYAN);
        canvas.save();
        canvas.translate(center.x, center.y);
        canvas.rotate(45, 0, 0);
        canvas.translate(-center.x, -center.y);
        canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/rotate.png");
  });
});
