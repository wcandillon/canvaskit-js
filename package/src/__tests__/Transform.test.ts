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
  it("4 scaled and translated rounded rectangles", async () => {
    const image = await skia.eval(
      ({ CanvasKit, width, height, canvas, center }) => {
        const paints = ["#61DAFB", "#fb61da", "#dafb61", "#61fbcf"].map(
          (color) => {
            const paint = new CanvasKit.Paint();
            paint.setColor(CanvasKit.parseColorString(color));
            return paint;
          }
        );
        const rect = CanvasKit.RRectXY(
          CanvasKit.XYWHRect(0, 0, width, height),
          32,
          32
        );
        canvas.save();
        canvas.scale(0.5, 0.5);
        canvas.drawRRect(rect, paints[0]);
        canvas.restore();
        canvas.save();
        canvas.translate(center.x, 0);
        canvas.scale(0.5, 0.5);
        canvas.drawRRect(rect, paints[1]);
        canvas.restore();
        canvas.save();
        canvas.translate(0, center.y);
        canvas.scale(0.5, 0.5);
        canvas.drawRRect(rect, paints[2]);
        canvas.restore();
        canvas.save();
        canvas.translate(center.x, center.y);
        canvas.scale(0.5, 0.5);
        canvas.drawRRect(rect, paints[3]);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/rectangles.png");
  });
});
