import { checkImage, remoteSurface } from "./setup";

describe("HelloWorld", () => {
  it("should draw a path", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, width, height, c2d: { Path, Paint } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(width, 0));
        path.addLinear(new DOMPoint(width, height));
        path.close();
        const paint = new Paint();
        paint.setColor("cyan");
        canvas.drawPath(path, paint);
      }
    );
    checkImage(image, "snapshots/c2d/simple.png");
  });
});
