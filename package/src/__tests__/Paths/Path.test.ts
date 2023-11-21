/* eslint-disable max-len */
//import type { Path } from "canvaskit-wasm";

import type { Path } from "canvaskit-wasm";

import { checkImage, processResult, setupRealSkia, skia } from "../setup";

const roundtrip = (path: Path) => CanvasKit.Path.MakeFromCmds(path.toCmds())!;

describe("Path Behavior", () => {
  it("should add path", () => {
    const results: string[] = [];
    const path = new CanvasKit.Path();
    const path2 = new CanvasKit.Path();
    path.moveTo(20, 20);
    path.lineTo(20, 40);
    path.lineTo(40, 20);
    path2.moveTo(60, 60);
    path2.lineTo(80, 60);
    path2.lineTo(80, 40);
    roundtrip(path);
    roundtrip(path2);
    for (let j = 0; j < 2; j++) {
      const p = path.copy().addPath(path2)!;
      results.push(p.toSVGString());
    }
    expect(results).toEqual([
      "M20 20 L20 40 L40 20 M60 60 L80 60 L80 40",
      "M20 20 L20 40 L40 20 M60 60 L80 60 L80 40",
    ]);
  });
  it("Should draw the reference result for an arc", () => {
    const { surface, canvas, width: size } = setupRealSkia();
    const path = new RealCanvasKit.Path();
    const arcRect = RealCanvasKit.XYWHRect(0, 0, size, size);
    path.addArc(arcRect, 45, 270);
    const paint = new RealCanvasKit.Paint();
    paint.setColor(RealCanvasKit.CYAN);
    canvas.drawPath(path, paint);
    processResult(surface, "snapshots/path-arc.png");
  });

  it("Should draw an arc", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width: size }) => {
      const path = new CanvasKit.Path();
      const arcRect = CanvasKit.XYWHRect(0, 0, size, size);
      path.addArc(arcRect, 45, 270);
      const paint = new CanvasKit.Paint();
      paint.setColor(CanvasKit.CYAN);
      canvas.drawPath(path, paint);
    });
    checkImage(image, "snapshots/path-arc.png");
  });

  it("builds the conic to quad reference result", () => {
    //   https://fiddle.skia.org/c/@Path_ConvertConicToQuads
    const { canvas, surface } = setupRealSkia();
    const conicPaint = new RealCanvasKit.Paint();
    conicPaint.setAntiAlias(true);
    conicPaint.setStyle(RealCanvasKit.PaintStyle.Stroke);
    const quadPaint = conicPaint.copy();
    quadPaint.setColor(RealCanvasKit.Color(1, 0, 0, 1.0));
    const conic = [
      Float32Array.of(20, 170),
      Float32Array.of(80, 170),
      Float32Array.of(80, 230),
    ];
    for (const weight of [0.25, 0.5, 0.707, 0.85, 1.0]) {
      const path = new RealCanvasKit.Path();
      path.moveTo(conic[0][0], conic[0][1]);
      path.conicTo(conic[1][0], conic[1][1], conic[2][0], conic[2][1], weight);
      canvas.drawPath(path, conicPaint);
      canvas.drawPath(path, quadPaint);
      canvas.translate(50, -50);
    }
    processResult(surface, "snapshots/conic.png");
  });

  it("Should draw a conic", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const conicPaint = new CanvasKit.Paint();
      conicPaint.setAntiAlias(true);
      conicPaint.setStyle(CanvasKit.PaintStyle.Stroke);
      const quadPaint = conicPaint.copy();
      quadPaint.setColor(CanvasKit.Color(1, 0, 0, 1.0));
      const conic = [
        Float32Array.of(20, 170),
        Float32Array.of(80, 170),
        Float32Array.of(80, 230),
      ];
      for (const weight of [0.25, 0.5, 0.707, 0.85, 1.0]) {
        const path = new CanvasKit.Path();
        path.moveTo(conic[0][0], conic[0][1]);
        path.conicTo(
          conic[1][0],
          conic[1][1],
          conic[2][0],
          conic[2][1],
          weight
        );
        canvas.drawPath(path, conicPaint);
        canvas.drawPath(path, quadPaint);
        canvas.translate(50, -50);
      }
    });
    checkImage(image, "snapshots/conic.png", { maxPixelDiff: 500 });
  });

  // <svg width="158" height="66" viewBox="0 0 158 66" fill="none" xmlns="http://www.w3.org/2000/svg">
  //<path d="M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  //</svg>

  it("Should draw hello", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const colors = [
        "#3FCEBC",
        "#3СВСЕВ",
        "#5F96E7",
        "#816FE3",
        "#9F5EE2",
        "#BD4CEO",
        "#DE589F",
        "#FF645E",
        "#FDA859",
        "#FAEC54",
        "#9EE671",
        "#41E08D",
      ].map((cl) => CanvasKit.parseColorString(cl));
      const paint = new CanvasKit.Paint();
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(8);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          Float32Array.of(0, 0),
          Float32Array.of(width, 0),
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.translate(51.4, 41.2);
      const path = CanvasKit.Path.MakeFromSVGString(
        "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
      )!;
      canvas.drawPath(path, paint);
    });
    checkImage(image, "snapshots/hello.png");
  });

  it("Should trim hello", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const colors = [
        "#3FCEBC",
        "#3СВСЕВ",
        "#5F96E7",
        "#816FE3",
        "#9F5EE2",
        "#BD4CEO",
        "#DE589F",
        "#FF645E",
        "#FDA859",
        "#FAEC54",
        "#9EE671",
        "#41E08D",
      ].map((cl) => CanvasKit.parseColorString(cl));
      const paint = new CanvasKit.Paint();
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(8);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          Float32Array.of(0, 0),
          Float32Array.of(width, 0),
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.translate(51.4, 41.2);
      const path = CanvasKit.Path.MakeFromSVGString(
        "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
      )!;
      path.trim(0, 0.5, false);
      canvas.drawPath(path, paint);
    });
    checkImage(image, "snapshots/trim-hello.png");
  });

  it("Should trim hello with scale", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const colors = [
        "#3FCEBC",
        "#3СВСЕВ",
        "#5F96E7",
        "#816FE3",
        "#9F5EE2",
        "#BD4CEO",
        "#DE589F",
        "#FF645E",
        "#FDA859",
        "#FAEC54",
        "#9EE671",
        "#41E08D",
      ].map((cl) => CanvasKit.parseColorString(cl));
      const paint = new CanvasKit.Paint();
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(8);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          Float32Array.of(0, 0),
          Float32Array.of(width, 0),
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.translate(51.4, 41.2);
      const path = CanvasKit.Path.MakeFromSVGString(
        "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
      )!;
      path.trim(0, 0.5, false);
      canvas.scale(2, 2);
      canvas.drawPath(path, paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/trim-hello-scaled.png");
  });

  it("Should trim hello with scale reference", () => {
    const { canvas, surface } = setupRealSkia();
    const colors = [
      "#3FCEBC",
      "#3cbceb",
      "#5F96E7",
      "#816FE3",
      "#9F5EE2",
      "#bd4ce0",
      "#DE589F",
      "#FF645E",
      "#FDA859",
      "#FAEC54",
      "#9EE671",
      "#41E08D",
    ].map((cl) => RealCanvasKit.parseColorString(cl));
    const paint = new RealCanvasKit.Paint();
    paint.setStyle(RealCanvasKit.PaintStyle.Stroke);
    paint.setStrokeWidth(8);
    paint.setStrokeCap(RealCanvasKit.StrokeCap.Round);
    paint.setStrokeJoin(RealCanvasKit.StrokeJoin.Round);
    paint.setShader(
      RealCanvasKit.Shader.MakeLinearGradient(
        Float32Array.of(0, 0),
        Float32Array.of(256, 0),
        colors,
        null,
        RealCanvasKit.TileMode.Clamp
      )
    );
    canvas.translate(51.4, 41.2);
    const path = RealCanvasKit.Path.MakeFromSVGString(
      "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
    )!;
    path.trim(0, 0.5, false);
    canvas.scale(2, 4);
    canvas.drawPath(path, paint);
    canvas.restore();
    processResult(surface, "snapshots/trim-hello-scaled2.png", true);
  });

  it("Should trim hello with scale (2)", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const colors = [
        "#3FCEBC",
        "#3cbceb",
        "#5F96E7",
        "#816FE3",
        "#9F5EE2",
        "#bd4ce0",
        "#DE589F",
        "#FF645E",
        "#FDA859",
        "#FAEC54",
        "#9EE671",
        "#41E08D",
      ].map((cl) => CanvasKit.parseColorString(cl));
      const paint = new CanvasKit.Paint();
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(8);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          Float32Array.of(0, 0),
          Float32Array.of(width, 0),
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.translate(51.4, 41.2);
      const path = CanvasKit.Path.MakeFromSVGString(
        "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
      )!;
      path.trim(0, 0.5, false);
      canvas.scale(2, 4);
      canvas.drawPath(path, paint);
      canvas.restore();
    });
    checkImage(image, "snapshots/trim-hello-scaled2.png", {
      maxPixelDiff: 4000,
    });
  });

  it("Should dash hello", async () => {
    const image = await skia.draw(({ CanvasKit, canvas, width }) => {
      const colors = [
        "#3FCEBC",
        "#3СВСЕВ",
        "#5F96E7",
        "#816FE3",
        "#9F5EE2",
        "#BD4CEO",
        "#DE589F",
        "#FF645E",
        "#FDA859",
        "#FAEC54",
        "#9EE671",
        "#41E08D",
      ].map((cl) => CanvasKit.parseColorString(cl));
      const paint = new CanvasKit.Paint();
      paint.setStyle(CanvasKit.PaintStyle.Stroke);
      paint.setStrokeWidth(3);
      paint.setStrokeCap(CanvasKit.StrokeCap.Round);
      paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          Float32Array.of(0, 0),
          Float32Array.of(width, 0),
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.translate(51.4, 41.2);
      const path = CanvasKit.Path.MakeFromSVGString(
        "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641"
      )!;
      path.dash(5, 5, 0);
      canvas.drawPath(path, paint);
    });
    checkImage(image, "snapshots/dash-hello.png", { overwrite: true });
  });

  // M50 798.409C50 798.409 172.047 665.479 275.44 546.213C456.322 337.625 654.197 94.016 486.028 53.2177C424.924 38.3733 378.131 101.103 349.064 150.425C229.094 353.427 191.818 689.933 190.253 971.626C222.865 873.493 340.025 614.976 454.214 622.095C586.099 630.3 470.44 827.97 500.05 913.589C545.789 1034.23 671.541 940.533 741.045 891.434C855.841 810.285 929.497 743.852 929.497 645.623C929.497 521.44 758.006 561.249 719.708 660.595C689.78 738.169 690.962 854.531 738.873 912.791C796.974 983.47 925.313 995.122 1003.6 926.582C1082.88 857.148 1139.29 754.514 1184.07 685.783C1296.63 512.885 1489.68 280.737 1440.81 101.582C1434.17 77.2243 1413.02 58.6128 1387.79 57.6232C1263.73 52.8027 1226.1 322.333 1205.37 418.519C1184.39 515.949 1108.97 839.91 1198.22 941.267C1298.26 1054.66 1431.96 843.389 1490.64 745.288C1503.41 724.985 1515.97 703.021 1527.11 685.91C1639.71 513.012 1832.76 280.864 1783.86 101.71C1777.25 77.3519 1756.1 58.7404 1730.87 57.7508C1606.81 52.9304 1569.18 322.461 1548.45 418.646C1527.43 516.077 1452.05 840.037 1541.3 941.394C1641.3 1054.79 1802.83 853.381 1835.54 749.087C1882.49 599.238 1989.81 553.46 2117.48 581.265C1974.03 537.753 1861.79 643.133 1835.54 750.045C1816.92 825.927 1838.35 906.47 1920.53 949.918C2141.85 1066.89 2379.05 681.505 2117.48 581.265C2062.42 586.373 2038.4 659.414 2061.2 732.87C2096.34 848.401 2256.04 862.128 2348 822.958
  // 2399 x 1025

  it("builds the reference result", () => {
    const { canvas, surface } = setupRealSkia();
    const paint = new RealCanvasKit.Paint();
    paint.setStrokeWidth(1.0);
    paint.setAntiAlias(true);
    paint.setColor(RealCanvasKit.Color(0, 0, 0, 1.0));
    paint.setStyle(RealCanvasKit.PaintStyle.Stroke);

    const path = new RealCanvasKit.Path();
    path.moveTo(20, 5);
    path.lineTo(30, 20);
    path.lineTo(40, 10);
    path.lineTo(50, 20);
    path.lineTo(60, 0);
    path.lineTo(20, 5);

    path.moveTo(20, 80);
    path.cubicTo(90, 10, 160, 150, 190, 10);

    path.moveTo(36, 148);
    path.quadTo(66, 188, 120, 136);
    path.lineTo(36, 148);

    path.moveTo(150, 180);
    path.arcToTangent(150, 100, 50, 200, 20);
    path.lineTo(160, 160);

    path.moveTo(20, 120);
    path.lineTo(20, 120);

    path.transform([2, 0, 0, 0, 2, 0, 0, 0, 1]);

    canvas.drawPath(path, paint);

    const rrect = RealCanvasKit.RRectXY([100, 10, 140, 62], 10, 4);

    const rrectPath = new RealCanvasKit.Path().addRRect(rrect, true);

    canvas.drawPath(rrectPath, paint);
    processResult(surface, "snapshots/path1.png");
  });
});
