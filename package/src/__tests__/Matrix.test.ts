/* eslint-disable max-len */
import { setupRealSkia, skia } from "./setup";

const expectArrayCloseTo = (a: number[], b: number[], precision = 0.0001) => {
  expect(a).toBeApproximatelyEqual(b, precision);
};

describe("CanvasKit's Matrix Helpers", () => {
  describe("3x3 matrices", () => {
    it("can make a translated 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.translated(5, -1),
        [1, 0, 5, 0, 1, -1, 0, 0, 1]
      );
    });

    it("can make a scaled 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.scaled(2, 3),
        [2, 0, 0, 0, 3, 0, 0, 0, 1]
      );
    });

    it("can make a rotated 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.rotated(Math.PI, 9, 9),
        [-1, 0, 18, 0, -1, 18, 0, 0, 1]
      );
      expectArrayCloseTo(
        CanvasKit.Matrix.rotated(Math.PI, 9, 9),
        RealCanvasKit.Matrix.rotated(Math.PI, 9, 9)
      );
    });

    it("can make a skewed 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.skewed(4, 3, 2, 1),
        [1, 4, -8, 3, 1, -3, 0, 0, 1]
      );
      expectArrayCloseTo(
        CanvasKit.Matrix.skewed(4, 3, 2, 1),
        RealCanvasKit.Matrix.skewed(4, 3, 2, 1)
      );
    });

    it("can rotate a 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.rotated(Math.PI / 4),
        RealCanvasKit.Matrix.rotated(Math.PI / 4)
      );
    });

    it("can rotate and translate a 3x3 matrix", () => {
      expectArrayCloseTo(
        CanvasKit.Matrix.multiply(
          CanvasKit.Matrix.rotated(Math.PI / 4),
          CanvasKit.Matrix.translated(20, 10)
        ),
        RealCanvasKit.Matrix.multiply(
          RealCanvasKit.Matrix.rotated(Math.PI / 4),
          RealCanvasKit.Matrix.translated(20, 10)
        )
      );
    });

    it("can multiply 3x3 matrices", () => {
      const a = [0.1, 0.2, 0.3, 0.0, 0.6, 0.7, 0.9, -0.9, -0.8];
      const b = [2.0, 3.0, 4.0, -3.0, -4.0, -5.0, 7.0, 8.0, 9.0];
      const expected = [1.7, 1.9, 2.1, 3.1, 3.2, 3.3, -1.1, -0.1, 0.9];
      expectArrayCloseTo(CanvasKit.Matrix.multiply(a, b), expected);
    });

    it("satisfies the inverse rule for 3x3 matrics", () => {
      // a matrix times its inverse is the identity matrix.
      const a = [0.1, 0.2, 0.3, 0.0, 0.6, 0.7, 0.9, -0.9, -0.8];
      const b = CanvasKit.Matrix.invert(a)!;
      expectArrayCloseTo(
        CanvasKit.Matrix.multiply(a, b),
        CanvasKit.Matrix.identity()
      );
    });

    it("maps 2D points correctly with a 3x3 matrix", () => {
      const a = [3, 0, -4, 0, 2, 4, 0, 0, 1];
      const points = [0, 0, 1, 1];
      const expected = [-4, 4, -1, 6];
      expectArrayCloseTo(CanvasKit.Matrix.mapPoints(a, points), expected);
    });

    it("Check matrices from CanvasKit", () => {
      const { canvas } = setupRealSkia();
      const totalMatrix = canvas.getTotalMatrix();
      const localMatrix = canvas.getLocalToDevice();
      expect(totalMatrix).toBeApproximatelyEqual(
        RealCanvasKit.Matrix.identity()
      );
      expect(localMatrix).toBeApproximatelyEqual(RealCanvasKit.M44.identity());
      expect(totalMatrix).toBeApproximatelyEqual(CanvasKit.Matrix.identity());
      expect(localMatrix).toBeApproximatelyEqual(CanvasKit.M44.identity());
    });

    it("local matrix is the identity matrix", async () => {
      const localMatrix = await skia.eval(({ canvas }) => {
        return Array.from(canvas.getLocalToDevice());
      });
      expect(localMatrix).toBeApproximatelyEqual(RealCanvasKit.M44.identity());
      expect(localMatrix).toBeApproximatelyEqual(CanvasKit.M44.identity());
    });

    it("total matrix is the identity matrix", async () => {
      const { totalMatrix, localMatrix } = await skia.eval(({ canvas }) => {
        return {
          totalMatrix: canvas.getTotalMatrix(),
          localMatrix: Array.from(canvas.getLocalToDevice()),
        };
      });
      expect(totalMatrix).toBeApproximatelyEqual(
        RealCanvasKit.Matrix.identity()
      );
      expect(localMatrix).toBeApproximatelyEqual(RealCanvasKit.M44.identity());
      expect(totalMatrix).toBeApproximatelyEqual(CanvasKit.Matrix.identity());
      expect(localMatrix).toBeApproximatelyEqual(CanvasKit.M44.identity());
    });

    it("total matrix matches (reference)", async () => {
      const { canvas } = setupRealSkia();
      canvas.concat(RealCanvasKit.Matrix.rotated(Math.PI / 4));
      const totalMatrix = canvas.getTotalMatrix();
      expect(totalMatrix).toBeApproximatelyEqual(
        RealCanvasKit.Matrix.rotated(Math.PI / 4),
        0.001
      );
    });

    it("total matrix matches", async () => {
      expect(RealCanvasKit.Matrix.rotated(Math.PI / 4)).toBeApproximatelyEqual(
        CanvasKit.Matrix.rotated(Math.PI / 4),
        0.001
      );
      const { totalMatrix } = await skia.eval(({ canvas }) => {
        canvas.concat(CanvasKit.Matrix.rotated(Math.PI / 4));
        return {
          totalMatrix: canvas.getTotalMatrix(),
          localMatrix: Array.from(canvas.getLocalToDevice()),
        };
      });

      expect(totalMatrix).toBeApproximatelyEqual(
        RealCanvasKit.Matrix.rotated(Math.PI / 4),
        0.001
      );
    });

    it("can change the 3x3 matrix on the canvas and read it back", async () => {
      const result = await skia.eval(({ CanvasKit, canvas }) => {
        canvas.save();
        const garbageMatrix = new Float32Array(16);
        garbageMatrix.fill(-3);
        canvas.concat(garbageMatrix);
        canvas.restore();

        canvas.concat(CanvasKit.Matrix.rotated(Math.PI / 4));
        const d = new DOMMatrix().translate(20, 10);
        canvas.concat(d);
        const totalMatrix = canvas.getTotalMatrix();
        const localMatrix = Array.from(canvas.getLocalToDevice());
        return { totalMatrix, localMatrix };
      });
      const { totalMatrix, localMatrix } = result;
      const expected = RealCanvasKit.Matrix.multiply(
        RealCanvasKit.Matrix.rotated(Math.PI / 4),
        RealCanvasKit.Matrix.translated(20, 10)
      );
      expect(expected).toBeApproximatelyEqual(totalMatrix);

      expect(localMatrix).toBeApproximatelyEqual([
        0.707106, -0.707106, 0, 7.071067, 0.707106, 0.707106, 0, 21.213203, 0,
        0, 1, 0, 0, 0, 0, 1,
      ]);
    });

    it("can accept a 3x2 matrix", async () => {
      const result = await skia.eval(({ canvas }) => {
        canvas.save();
        const garbageMatrix = new Float32Array(16);
        garbageMatrix.fill(-3);
        canvas.concat(garbageMatrix);
        canvas.restore();

        canvas.concat([1.4, -0.2, 12, 0.2, 1.4, 24]);

        const totalMatrix = canvas.getTotalMatrix();
        const localMatrix = Array.from(canvas.getLocalToDevice());
        return { totalMatrix, localMatrix };
      });
      const { totalMatrix, localMatrix } = result;

      expect(totalMatrix).toBeApproximatelyEqual([
        1.4, -0.2, 12, 0.2, 1.4, 24, 0, 0, 1,
      ]);

      // The 3x2 should be expanded into a 4x4, with identity in the 3rd row and column
      // and the perspective filled in.
      expect(localMatrix).toBeApproximatelyEqual([
        1.4, -0.2, 0, 12, 0.2, 1.4, 0, 24, 0, 0, 1, 0, 0, 0, 0, 1,
      ]);
    });

    // it("supports 4x4 matrix operation", () => {
    //   expect(
    //     CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4)
    //   ).toBeApproximatelyEqual(
    //     RealCanvasKit.M44.rotated([0, 1, 0], Math.PI / 4)
    //   );
    //   expect(
    //     CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //   ).toBeApproximatelyEqual(
    //     RealCanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //   );

    //   expect(
    //     CanvasKit.M44.multiply(
    //       CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
    //       CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //     )
    //   ).toBeApproximatelyEqual(
    //     RealCanvasKit.M44.multiply(
    //       RealCanvasKit.M44.identity(),
    //       RealCanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
    //       RealCanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //     )
    //   );
    // });

    /*

        const radiansToDegrees = (rad) => {
           return (rad / Math.PI) * 180;
        };

        // this should draw the same as concat_with4x4_canvas
        gm('concat_dommatrix', (canvas) => {
            const path = starPath(CanvasKit, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
            const paint = new CanvasKit.Paint();
            paint.setAntiAlias(true);
            canvas.concat(new DOMMatrix().translate(CANVAS_WIDTH/2, 0, 0));
            canvas.concat(new DOMMatrix().rotateAxisAngle(1, 0, 0, radiansToDegrees(Math.PI/3)));
            canvas.concat(new DOMMatrix().rotateAxisAngle(0, 1, 0, radiansToDegrees(Math.PI/4)));
            canvas.concat(new DOMMatrix().rotateAxisAngle(0, 0, 1, radiansToDegrees(Math.PI/16)));
            canvas.concat(new DOMMatrix().translate(-CANVAS_WIDTH/2, 0, 0));

            const localMatrix = canvas.getLocalToDevice();
            expect4x4MatricesToMatch([
             0.693519, -0.137949,  0.707106,   91.944030,
             0.698150,  0.370924, -0.612372, -209.445297,
            -0.177806,  0.918359,  0.353553,   53.342029,
             0       ,  0       ,  0       ,    1       ], localMatrix);

            // Draw some stripes to help the eye detect the turn
            const stripeWidth = 10;
            paint.setColor(CanvasKit.BLACK);
            for (let i = 0; i < CANVAS_WIDTH; i += 2*stripeWidth) {
                canvas.drawRect(CanvasKit.LTRBRect(i, 0, i + stripeWidth, CANVAS_HEIGHT), paint);
            }

            paint.setColor(CanvasKit.YELLOW);
            canvas.drawPath(path, paint);
            paint.delete();
            path.delete();
        });

        */

    // it("can change the 4x4 matrix on the canvas and read it back'", async () => {
    //   const localMatrix = await skia.eval(({ canvas }) => {
    //     canvas.concat(CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4));
    //     canvas.concat(CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8));

    //     return Array.from(canvas.getLocalToDevice());
    //   });

    //   const expected = RealCanvasKit.M44.multiply(
    //     RealCanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
    //     RealCanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //   );
    //   expect(localMatrix).toBeApproximatelyEqual(expected);

    //   const expected2 = CanvasKit.M44.multiply(
    //     CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
    //     CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
    //   );
    //   expect(localMatrix).toBeApproximatelyEqual(expected2);
    // });

    // it('can change the device clip bounds to the canvas and read it back', () => {
    //     // We need to use the Canvas constructor with a width/height or there is no maximum
    //     // clip area, and all clipping will result in a clip of [0, 0, 0, 0]
    //     const canvas = new CanvasKit.Canvas(300, 400);
    //     let clip = canvas.getDeviceClipBounds();
    //     expect(clip).toEqual(Int32Array.of(0, 0, 300, 400));

    //     canvas.clipRect(CanvasKit.LTRBRect(10, 20, 30, 45), CanvasKit.ClipOp.Intersect, false);
    //     canvas.getDeviceClipBounds(clip);
    //     expect(clip).toEqual(Int32Array.of(10, 20, 30, 45));
    // });

    // gm('concat_with4x4_canvas', (canvas) => {
    //     const path = starPath(CanvasKit, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    //     const paint = new CanvasKit.Paint();
    //     paint.setAntiAlias(true);

    //     // Rotate it a bit on all 3 major axis, centered on the screen.
    //     // To play with rotations, see https://jsfiddle.skia.org/canvaskit/0525300405796aa87c3b84cc0d5748516fca0045d7d6d9c7840710ab771edcd4
    //     const turn = CanvasKit.M44.multiply(
    //       CanvasKit.M44.translated([CANVAS_WIDTH/2, 0, 0]),
    //       CanvasKit.M44.rotated([1, 0, 0], Math.PI/3),
    //       CanvasKit.M44.rotated([0, 1, 0], Math.PI/4),
    //       CanvasKit.M44.rotated([0, 0, 1], Math.PI/16),
    //       CanvasKit.M44.translated([-CANVAS_WIDTH/2, 0, 0]),
    //     );
    //     canvas.concat(turn);

    //     // Draw some stripes to help the eye detect the turn
    //     const stripeWidth = 10;
    //     paint.setColor(CanvasKit.BLACK);
    //     for (let i = 0; i < CANVAS_WIDTH; i += 2*stripeWidth) {
    //         canvas.drawRect(CanvasKit.LTRBRect(i, 0, i + stripeWidth, CANVAS_HEIGHT), paint);
    //     }

    //     paint.setColor(CanvasKit.YELLOW);
    //     canvas.drawPath(path, paint);
    //     paint.delete();
    //     path.delete();
    // });
  });

  // describe 3x3
  // describe("4x4 matrices", () => {
  //   it("can make a translated 4x4 matrix", () => {
  //     expectArrayCloseTo(
  //       CanvasKit.M44.translated([5, 6, 7]),
  //       [1, 0, 0, 5, 0, 1, 0, 6, 0, 0, 1, 7, 0, 0, 0, 1]
  //     );
  //   });

  //   it("can make a scaled 4x4 matrix", () => {
  //     expectArrayCloseTo(
  //       CanvasKit.M44.scaled([5, 6, 7]),
  //       [5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1]
  //     );
  //   });

  //   it("can make a rotated 4x4 matrix", () => {
  //     expectArrayCloseTo(CanvasKit.M44.rotated([1, 1, 1], Math.PI), [
  //       -1 / 3,
  //       2 / 3,
  //       2 / 3,
  //       0,
  //       2 / 3,
  //       -1 / 3,
  //       2 / 3,
  //       0,
  //       2 / 3,
  //       2 / 3,
  //       -1 / 3,
  //       0,
  //       0,
  //       0,
  //       0,
  //       1,
  //     ]);
  //   });

  //   it("can make a 4x4 matrix looking from eye to center", () => {
  //     const eye = [1, 0, 0];
  //     const center = [1, 0, 1];
  //     const up = [0, 1, 0];
  //     expectArrayCloseTo(
  //       CanvasKit.M44.lookat(eye, center, up),
  //       [-1, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
  //     );
  //   });

  //   it("can make a 4x4 prespective matrix", () => {
  //     expectArrayCloseTo(
  //       CanvasKit.M44.perspective(2, 10, Math.PI / 2),
  //       [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.5, 5, 0, 0, -1, 1]
  //     );
  //   });

  //   it("can multiply 4x4 matrices", () => {
  //     const a = [
  //       0.1, 0.2, 0.3, 0.4, 0.0, 0.6, 0.7, 0.8, 0.9, -0.9, -0.8, -0.7, -0.6,
  //       -0.5, -0.4, -0.3,
  //     ];
  //     const b = [
  //       2.0, 3.0, 4.0, 5.0, -3.0, -4.0, -5.0, -6.0, 7.0, 8.0, 9.0, 10.0, -4.0,
  //       -3.0, -2.0, -1.0,
  //     ];
  //     const expected = [
  //       0.1, 0.7, 1.3, 1.9, -0.1, 0.8, 1.7, 2.6, 1.7, 2.0, 2.3, 2.6, -1.3, -2.1,
  //       -2.9, -3.7,
  //     ];
  //     expectArrayCloseTo(CanvasKit.M44.multiply(a, b), expected);
  //   });

  //   it("satisfies the identity rule for 4x4 matrices", () => {
  //     const a = [
  //       0.1, 0.2, 0.3, 0.4, 0.0, 0.6, 0.7, 0.8, 0.9, 0.9, -0.8, -0.7, -0.6,
  //       -0.5, -0.4, -0.3,
  //     ];
  //     const b = CanvasKit.M44.invert(a)!;
  //     expectArrayCloseTo(
  //       CanvasKit.M44.multiply(a, b),
  //       CanvasKit.M44.identity()
  //     );
  //   });

  //   it("can create a camera setup matrix", () => {
  //     const camAngle = Math.PI / 12;
  //     const cam = {
  //       eye: [0, 0, 1 / Math.tan(camAngle / 2) - 1],
  //       coa: [0, 0, 0],
  //       up: [0, 1, 0],
  //       near: 0.02,
  //       far: 4,
  //       angle: camAngle,
  //     };
  //     const mat = CanvasKit.M44.setupCamera(
  //       CanvasKit.LTRBRect(0, 0, 200, 200),
  //       200,
  //       cam
  //     );
  //     // these values came from an invocation of setupCamera visually inspected.
  //     const expected = [
  //       7.595754, 0, -0.5, 0, 0, 7.595754, -0.5, 0, 0, 0, 1.01005, -1324.368418,
  //       0, 0, -0.005, 7.595754,
  //     ];
  //     expectArrayCloseTo(mat, expected, 5);
  //   });
  // }); // describe 4x4
});
