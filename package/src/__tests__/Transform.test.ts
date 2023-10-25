import { checkImage, processResult, setupRealSkia, skia } from "./setup";

describe("Transforms", () => {
  it("should rotate on a pivot point", async () => {
    const image = await skia.draw(
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
    const image = await skia.draw(
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
    const image = await skia.draw(
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
  it("Build the reference result (1)", () => {
    const { surface, canvas, width, height, center } = setupRealSkia();
    const mix = (value: number, x: number, y: number) =>
      x * (1 - value) + y * value;
    const r = mix(1, width / 4, width / 2);
    canvas.drawColor(RealCanvasKit.BLACK);
    const paint = new RealCanvasKit.Paint();
    paint.setAntiAlias(true);
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [width, height],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.save();
    canvas.translate(center[0], center[1]);
    canvas.drawCircle(0, 0, r, paint);
    canvas.translate(-center[0], -center[1]);
    canvas.restore();
    processResult(surface, "snapshots/circle-gradient.png");
  });
  it("Build the reference result (2)", () => {
    const { surface, canvas, width, height, center } = setupRealSkia();
    const mix = (value: number, x: number, y: number) =>
      x * (1 - value) + y * value;
    const r = mix(1, width / 4, width / 2);
    canvas.drawColor(RealCanvasKit.BLACK);
    const paint = new RealCanvasKit.Paint();
    paint.setAntiAlias(true);
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [0, height],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.save();
    canvas.drawCircle(center[0], center[1], r, paint);
    canvas.restore();
    processResult(surface, "snapshots/circle-gradient2.png");
  });
  // it("should draw the circle centered", async () => {
  //   const image = await skia.draw(
  //     ({ CanvasKit, width, canvas, height, center }) => {
  //       const mix = (value: number, x: number, y: number) =>
  //         x * (1 - value) + y * value;
  //       const r = mix(1, width / 4, width / 2);
  //       canvas.drawColor(CanvasKit.BLACK);
  //       const paint = new CanvasKit.Paint();
  //       const colors = ["#FFF723", "#E70696"].map((cl) =>
  //         CanvasKit.parseColorString(cl)
  //       );
  //       paint.setShader(
  //         CanvasKit.Shader.MakeLinearGradient(
  //           [0, 0],
  //           [width, height],
  //           colors,
  //           null,
  //           CanvasKit.TileMode.Clamp
  //         )
  //       );
  //       canvas.save();
  //       canvas.translate(center.x, center.y);
  //       canvas.drawCircle(0, 0, r, paint);
  //       canvas.translate(-center.x, -center.y);
  //       canvas.restore();
  //     }
  //   );
  //   checkImage(image, "snapshots/circle-gradient.png", { showDiff: true });
  // });
  it("should draw the circle centered (2)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, width, canvas, height, center }) => {
        const mix = (value: number, x: number, y: number) =>
          x * (1 - value) + y * value;
        const r = mix(1, width / 4, width / 2);
        canvas.drawColor(CanvasKit.BLACK);
        const paint = new CanvasKit.Paint();
        const colors = ["#FFF723", "#E70696"].map((cl) =>
          CanvasKit.parseColorString(cl)
        );
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [0, 0],
            [0, height],
            colors,
            null,
            CanvasKit.TileMode.Clamp
          )
        );
        canvas.save();
        canvas.drawCircle(center.x, center.y, r, paint);
        canvas.restore();
      }
    );
    checkImage(image, "snapshots/circle-gradient2.png");
  });
  it("should draw the circle centered (3)", async () => {
    const image = await skia.draw(
      ({ CanvasKit, canvas }) => {
        canvas.drawColor(CanvasKit.BLACK);
        const paint = new CanvasKit.Paint();
        const colors = ["#FFF723", "#E70696"].map((cl) =>
          CanvasKit.parseColorString(cl)
        );
        paint.setShader(
          CanvasKit.Shader.MakeLinearGradient(
            [0, 0],
            [0, 256],
            colors,
            null,
            CanvasKit.TileMode.Clamp
          )
        );
        canvas.save();
        canvas.scale(2, 2);
        canvas.drawCircle(128, 128, 128, paint);
        canvas.restore();
      },
      { width: 512, height: 512 }
    );
    checkImage(image, "snapshots/circle-gradient3.png");
  });
  it("Build the reference result (3)", () => {
    const { surface, canvas, width, height } = setupRealSkia();
    canvas.concat(RealCanvasKit.M44.rotated([0, 1, 0], Math.PI / 4));
    canvas.concat(RealCanvasKit.M44.rotated([1, 0, 1], Math.PI / 8));
    const paint = new RealCanvasKit.Paint();
    paint.setAntiAlias(true);
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [0, height],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.drawRect(RealCanvasKit.XYWHRect(0, 0, width, height), paint);

    processResult(surface, "snapshots/m4.png");
  });
  it("Build the reference result (4)", () => {
    const { surface, canvas, width, height } = setupRealSkia();
    canvas.concat(
      RealCanvasKit.M44.multiply(
        RealCanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
        RealCanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
      )
    );
    const paint = new RealCanvasKit.Paint();
    paint.setAntiAlias(true);
    const colors = ["#FFF723", "#E70696"].map((cl) =>
      RealCanvasKit.parseColorString(cl)
    );
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        [0, 0],
        [0, height],
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.drawRect(RealCanvasKit.XYWHRect(0, 0, width, height), paint);

    processResult(surface, "snapshots/m4.png");
  });
  // it("should accept matrix4", async () => {
  //   const image = await skia.draw(({ CanvasKit, canvas, height, width }) => {
  //     canvas.concat(
  //       CanvasKit.M44.multiply(
  //         CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4),
  //         CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8)
  //       )
  //     );
  //     const paint = new CanvasKit.Paint();
  //     const colors = ["#FFF723", "#E70696"].map((cl) =>
  //       CanvasKit.parseColorString(cl)
  //     );
  //     paint.setShader(
  //       CanvasKit.Shader.MakeLinearGradient(
  //         [0, 0],
  //         [0, height],
  //         colors,
  //         null,
  //         CanvasKit.TileMode.Clamp
  //       )
  //     );
  //     canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
  //   });
  //   checkImage(image, "snapshots/m4.png");
  // });
  // it("should accept matrix4 (1)", async () => {
  //   const image = await skia.draw(({ CanvasKit, canvas, height, width }) => {
  //     const m4 = new DOMMatrix();
  //     canvas.concat(
  //       m4
  //         .multiply(m4.rotateAxisAngle(0, 1, 0, 180 / 4))
  //         .multiply(m4.rotateAxisAngle(1, 0, 1, 180 / 8))
  //     );
  //     const paint = new CanvasKit.Paint();
  //     const colors = ["#FFF723", "#E70696"].map((cl) =>
  //       CanvasKit.parseColorString(cl)
  //     );
  //     paint.setShader(
  //       CanvasKit.Shader.MakeLinearGradient(
  //         [0, 0],
  //         [0, height],
  //         colors,
  //         null,
  //         CanvasKit.TileMode.Clamp
  //       )
  //     );
  //     canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
  //   });
  //   checkImage(image, "snapshots/m4.png");
  // });
  // it("should accept matrix4 (2)", async () => {
  //   const image = await skia.draw(({ CanvasKit, canvas, height, width }) => {
  //     const m4 = new DOMMatrix();
  //     canvas.concat(m4.rotateAxisAngle(0, 1, 0, 180 / 4));
  //     canvas.concat(m4.rotateAxisAngle(1, 0, 1, 180 / 8));
  //     const paint = new CanvasKit.Paint();
  //     const colors = ["#FFF723", "#E70696"].map((cl) =>
  //       CanvasKit.parseColorString(cl)
  //     );
  //     paint.setShader(
  //       CanvasKit.Shader.MakeLinearGradient(
  //         [0, 0],
  //         [0, height],
  //         colors,
  //         null,
  //         CanvasKit.TileMode.Clamp
  //       )
  //     );
  //     canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
  //   });
  //   checkImage(image, "snapshots/m4.png");
  // });
  // it("should accept matrix4 (3)", async () => {
  //   const image = await skia.draw(({ CanvasKit, canvas, height, width }) => {
  //     canvas.concat(CanvasKit.M44.rotated([0, 1, 0], Math.PI / 4));
  //     canvas.concat(CanvasKit.M44.rotated([1, 0, 1], Math.PI / 8));
  //     const paint = new CanvasKit.Paint();
  //     paint.setAntiAlias(true);
  //     const colors = ["#FFF723", "#E70696"].map((cl) =>
  //       CanvasKit.parseColorString(cl)
  //     );
  //     paint.setShader(
  //       CanvasKit.Shader.MakeLinearGradient(
  //         [0, 0],
  //         [0, height],
  //         colors,
  //         null,
  //         CanvasKit.TileMode.Clamp
  //       )
  //     );
  //     canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
  //   });
  //   checkImage(image, "snapshots/m4.png");
  // });
  /*
  https://github.com/fserb/canvas2D/blob/master/spec/perspective-transforms.md
    // Javascript example, draws a trapezoid
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "magenta";
  ctx.fillRect(w/2 - 50, h/2 - 50, 100, 100);
  ctx.fillStyle = "rgba(0, 2550, 255, 0.8)";
  ctx.translate(w/2, h/2);
  ctx.perspective(100);
  ctx.rotate3d(1.0, 0, 0);
  ctx.translate(-w/2, -h/2);
  ctx.fillRect(w/2 - 50, h/2 - 50, 100, 100);
  */
});

/*
import fs from "fs";
import path from "path";

import { processResult } from "../../__tests__/setup";
import type { SkCanvas } from "../types/Canvas";

import { setupSkia } from "./setup";

describe("Test transforms", () => {
  it("Scale and rotate image", () => {
    testImageTransform((canvas) => {
      canvas.scale(0.75, 0.75);
      canvas.rotate(-30, 0, 0);
    }, "snapshots/transform/rotate.png");
  });

  it("Skew image", () => {
    testImageTransform((canvas) => {
      canvas.skew(-Math.PI / 6, 0);
    }, "snapshots/transform/skew.png");
  });

  it("Scale image", () => {
    testImageTransform((canvas) => {
      canvas.scale(2, 1);
    }, "snapshots/transform/scale.png");
  });

const testImageTransform = (cb: (canvas: SkCanvas) => void, result: string) => {
  const { canvas, surface, center, width, Skia } = setupSkia();
  const aspectRatio = 836 / 1324;
  const CARD_WIDTH = width - 64;
  const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
  const rect = Skia.XYWHRect(
    center.x - CARD_WIDTH / 2,
    center.y - CARD_HEIGHT / 2,
    CARD_WIDTH,
    CARD_HEIGHT
  );
  const image = Skia.Image.MakeImageFromEncoded(
    Skia.Data.fromBytes(
      fs.readFileSync(path.resolve(__dirname, "./assets/card.png"))
    )
  )!;
  const imgRect = Skia.XYWHRect(0, 0, image.width(), image.height());
  canvas.save();

  //  we pivot on the center of the card
  canvas.translate(center.x, center.y);
  cb(canvas);
  canvas.translate(-center.x, -center.y);

  const paint = Skia.Paint();
  canvas.drawImageRect(image, imgRect, rect, paint);
  canvas.restore();

  processResult(surface, result);
};
*/
