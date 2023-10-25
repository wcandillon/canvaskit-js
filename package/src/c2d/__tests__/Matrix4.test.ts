import { checkImage, remoteSurface } from "./setup";

describe("Perspective", () => {
  it("should draw a path", async () => {
    const image = await remoteSurface.draw(
      ({ canvas, width, height, c2d: { Path, Paint } }) => {
        const path = new Path();
        path.moveTo(new DOMPoint(0, 0));
        path.lineTo(new DOMPoint(width / 2, 0));
        path.lineTo(new DOMPoint(width / 2, height / 2));
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
  // it("should accept a 4x4 matrix", async () => {
  //   const image = await remoteSurface.draw(
  //     ({ canvas, width, height, c2d: { Path, Paint } }) => {
  //       const path = new Path();
  //       path.moveTo(new DOMPoint(0, 0));
  //       path.lineTo(new DOMPoint(width / 2, 0));
  //       path.lineTo(new DOMPoint(width / 2, height / 2));
  //       path.close();
  //       const paint = new Paint();
  //       paint.setColor("cyan");
  //       canvas.save();
  //       const matrix = new DOMMatrix();
  //       matrix.m34 = -1 / 600;
  //       matrix.scaleSelf(2, 2).rotateSelf(0, 45);
  //       canvas.concat(matrix);
  //       canvas.drawPath(path, paint);
  //       canvas.restore();
  //     }
  //   );
  //   checkImage(image, "snapshots/c2d/simpleTransform2.png");
  // });
  // it("perspective (1)", async () => {
  //   const image = await remoteSurface.draw(
  //     ({ canvas, width, height, center, c2d: { Path, Paint } }) => {
  //       const path = new Path();
  //       const size = 100;
  //       const pad = (width - size) / 2;
  //       path.moveTo(new DOMPoint(pad, pad));
  //       path.lineTo(new DOMPoint(width - pad, pad));
  //       path.lineTo(new DOMPoint(width - pad, height - pad));
  //       path.lineTo(new DOMPoint(pad, height - pad));
  //       path.close();
  //       const paint = new Paint();
  //       paint.setColor("cyan");
  //       canvas.save();
  //       const matrix = new DOMMatrix();
  //       matrix.m34 = -1 / (4 * width);
  //       matrix
  //         .translateSelf(center.x, center.y)
  //         .rotateAxisAngleSelf(1, 0, 0, 60)
  //         .translateSelf(-center.x, -center.y);
  //       canvas.concat(matrix);
  //       canvas.drawPath(path, paint);
  //       canvas.restore();
  //     }
  //   );
  //   checkImage(image, "snapshots/c2d/simpleTransform3.png");
  // });
  // it("perspective (2)", async () => {
  //   const image = await remoteSurface.draw(
  //     ({ canvas, width, height, center, c2d: { Path, Paint } }) => {
  //       const path = new Path();
  //       const size = 100;
  //       const pad = (width - size) / 2;
  //       path.moveTo(new DOMPoint(pad, pad));
  //       path.lineTo(new DOMPoint(width - pad, pad));
  //       path.lineTo(new DOMPoint(width - pad, height - pad));
  //       path.lineTo(new DOMPoint(pad, height - pad));
  //       path.close();
  //       const paint = new Paint();
  //       paint.setColor("cyan");
  //       canvas.save();
  //       const matrix = new DOMMatrix();
  //       matrix.m34 = -1 / (4 * width);
  //       matrix
  //         .translateSelf(center.x, center.y)
  //         .rotateAxisAngleSelf(0, 1, 0, 60)
  //         .translateSelf(-center.x, -center.y);
  //       canvas.concat(matrix);
  //       canvas.drawPath(path, paint);
  //       canvas.restore();
  //     }
  //   );
  //   checkImage(image, "snapshots/c2d/simpleTransform4.png");
  // });
});
