import { checkImage, remoteSurface } from "./setup";

describe("ImageFilter", () => {
  it("should blur an image", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, width, height, c2d: { Path, Paint, BlurImageFilter } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.lineTo(new DOMPoint(width / 2, 0));
        path.lineTo(new DOMPoint(width / 2, height / 2));
        path.close();
        const paint = new Paint();
        paint.setColor("cyan");
        paint.setImageFilter(new BlurImageFilter(20, 20));
        canvas.save();
        canvas.concat(new DOMMatrix().scale(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/blur.png");
  });
});
