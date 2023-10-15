import { checkImage, remoteSurface } from "./setup";

describe("HelloWorld", () => {
  it("should draw a path", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, width, height, c2d: { Path, Paint } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(width / 2, 0));
        path.addLinear(new DOMPoint(width / 2, height / 2));
        path.close();
        const paint = new Paint();
        paint.setColor("cyan");
        canvas.save();
        canvas.concat(new DOMMatrix().scale(2, 2));
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/simple.png");
  });
  it("should accept a 4x4 matrix", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, width, height, c2d: { Path, Paint } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.addLinear(new DOMPoint(width / 2, 0));
        path.addLinear(new DOMPoint(width / 2, height / 2));
        path.close();
        const paint = new Paint();
        paint.setColor("cyan");
        canvas.save();
        const matrix = new DOMMatrix();
        matrix.m34 = -1 / 600;
        matrix.scaleSelf(2, 2).rotateSelf(0, 45);
        canvas.concat(matrix);
        canvas.drawPath(path, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/c2d/simpleTransform2.png");
  });
});
