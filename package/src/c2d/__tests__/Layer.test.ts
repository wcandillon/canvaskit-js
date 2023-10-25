import { checkImage, remoteSurface } from "./setup";

describe("Layer", () => {
  it("should draw a backdrop blur", async () => {
    const image = await remoteSurface.draw(
      ({
        canvas,
        width,
        height,
        center,
        c2d: { Path, Paint, BlurImageFilter },
      }) => {
        const clipPath = new Path();
        clipPath.moveTo(new DOMPoint(0, center.y));
        clipPath.lineTo(new DOMPoint(width, center.y));
        clipPath.lineTo(new DOMPoint(width, height));
        clipPath.lineTo(new DOMPoint(0, height));
        clipPath.close();

        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.lineTo(new DOMPoint(center.x, 0));
        path.lineTo(new DOMPoint(center.x, center.y));
        path.close();

        const paint = new Paint();
        paint.setColor("rgba(0, 255, 255, 0.5)");
        canvas.save();
        canvas.concat(new DOMMatrix().scaleSelf(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
        canvas.clip(clipPath);

        canvas.save(new BlurImageFilter(20, 20));
        const rect = new Path();
        rect.moveTo(new DOMPoint(0, center.y));
        rect.lineTo(new DOMPoint(center.x, center.y));
        rect.lineTo(new DOMPoint(center.x, height));
        rect.lineTo(new DOMPoint(0, height));
        rect.close();
        const p = new Paint();
        p.setColor("rgba(255, 0, 0, 1)");
        canvas.drawPath(rect, p);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/backdrop.png", { overwrite: true });
  });
});
