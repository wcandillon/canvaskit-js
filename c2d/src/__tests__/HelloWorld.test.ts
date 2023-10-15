import { checkImage, remoteSurface } from "./setup";

describe("HelloWorld", () => {
  it("should draw a path", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, c2d: { Path, Paint } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(100, 100));
        path.addLinear(new DOMPoint(100, 0));
        path.close();
        const paint = new Paint();
        paint.setColor("red");
        canvas.drawPath(path, paint);
      }
    );
    checkImage(image, "snapshots/c2d/simple.png");
  });
});
