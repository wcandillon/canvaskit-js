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
        clipPath.addLinear(new DOMPoint(width, center.y));
        clipPath.addLinear(new DOMPoint(width, height));
        clipPath.addLinear(new DOMPoint(0, height));
        clipPath.close();

        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(center.x, 0));
        path.addLinear(new DOMPoint(center.x, center.y));
        path.close();

        const paint = new Paint();
        paint.setColor("cyan");
        canvas.save();
        canvas.concat(new DOMMatrix().scaleSelf(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
        canvas.clip(clipPath);

        canvas.save(new BlurImageFilter(20, 20));
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/backdrop.png", { overwrite: true });
  });
});
