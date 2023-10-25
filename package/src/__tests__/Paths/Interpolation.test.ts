/* eslint-disable max-len */
import "../setup";

const hello1 =
  "M2.40002 52.0275C2.40002 52.0275 10.5365 43.1655 17.4294 35.2144C29.4882 21.3085 42.6798 5.06793 31.4685 2.34804C27.395 1.35841 24.2754 5.5404 22.3376 8.82852C14.3396 22.362 11.8546 44.7957 11.7502 63.5753C13.9244 57.0331 21.735 39.7986 29.3476 40.2732C38.14 40.8202 30.4294 53.9982 32.4033 59.7061C35.4526 67.7487 43.8361 61.5024 48.4697 58.2291C56.1228 52.8192 61.0332 48.3903 61.0332 41.8417C61.0332 33.5629 49.6004 36.2168 47.0473 42.8399C45.052 48.0115 45.1308 55.7689 48.3249 59.6529C52.1983 64.3648 60.7542 65.1416 65.9734 60.5723C71.2586 55.9434 75.0191 49.1011 78.0045 44.519C85.5086 32.9925 98.3787 17.516 95.1207 5.57233C94.6778 3.94848 93.2681 2.70772 91.5859 2.64174C83.3153 2.32038 80.8068 20.2891 79.4248 26.7014C78.0258 33.1968 72.9983 54.7942 78.9478 61.5513C85.6171 69.1108 94.5308 55.0261 98.4426 48.4861C99.2943 47.1325 100.131 45.6683 100.874 44.5276C108.38 33.001 121.251 17.5245 117.99 5.58083C117.55 3.95699 116.14 2.71622 114.458 2.65025C106.187 2.32889 103.679 20.2976 102.297 26.71C100.896 33.2053 95.8702 54.8027 101.82 61.5598C108.487 69.1193 119.255 55.6923 121.436 48.7393C124.566 38.7494 131.721 35.6975 140.232 37.5512C130.669 34.6504 123.186 41.6757 121.436 48.8032C120.194 53.862 121.623 59.2315 127.102 62.1281C141.857 69.9259 157.67 44.2339 140.232 37.5512C136.561 37.8917 134.96 42.7611 136.48 47.6582C138.822 55.3603 149.469 56.2754 155.6 53.6641";
const hello2 =
  "M 2.4 52.0275 C 2.4 52.0275 10.5365 43.1655 17.4294 35.2144 C 29.4882 21.3085 42.6798 5.0679 47 12 C 27.395 1.3584 24.2754 5.5404 22.3376 8.8285 C 14.3396 22.362 11.8546 44.7957 11.7502 63.5753 C 13.9244 57.0331 21.735 39.7986 40 23 C 38.14 40.8202 30.4294 53.9982 32.4033 59.7061 C 35.4526 67.7487 43.8361 61.5024 48.4697 58.2291 C 56.1228 52.8192 61.0332 48.3903 68 36 C 61.0332 33.5629 49.6004 36.2168 47 29 C 45.052 48.0115 45.1308 55.7689 48.3249 59.6529 C 52.1983 64.3648 60.7542 65.1416 65.9734 60.5723 C 71.2586 55.9434 75.0191 49.1011 93 44 C 85.5086 32.9925 98.3787 17.516 95.1207 5.5723 C 94.6778 3.9485 93.2681 2.7077 91.5859 2.6417 C 83.3153 2.3204 80.8068 20.2891 64 23 C 78.0258 33.1968 72.9983 54.7942 78.9478 61.5513 C 85.6171 69.1108 94.5308 55.0261 98.4426 48.4861 C 99.2943 47.1325 100.131 45.6683 124 27 C 108.38 33.001 121.251 17.5245 117.99 5.5808 C 117.55 3.957 116.14 2.7162 114.458 2.6503 C 106.187 2.3289 103.679 20.2976 96 26 C 100.896 33.2053 95.8702 54.8027 101.82 61.5598 C 108.487 69.1193 119.255 55.6923 129 50 C 124.566 38.7494 131.721 35.6975 140.232 37.5512 C 130.669 34.6504 123.186 41.6757 112 45 C 120.194 53.862 121.623 59.2315 127.102 62.1281 C 141.857 69.9259 157.67 44.2339 140 19 C 136.561 37.8917 134.96 42.7611 136.48 47.6582 C 138.822 55.3603 149.469 56.2754 155.6 53.6641";
const hello3 =
  "M 2.4 52.0275 C 2.4 52.0275 10.5365 43.1655 17.4294 35.2144 C 29.4882 21.3085 42.6798 5.0679 47 12 C 27.395 1.3584 24.2754 5.5404 22.3376 8.8285 C 14.3396 22.362 11.8546 44.7957 11.7502 63.5753 C 13.9244 57.0331 21.735 39.7986 27 36 C 30.6667 33 34.3333 30 38 27 C 38.14 40.8202 30.4294 53.9982 32.4033 59.7061 C 29.6022 63.8041 26.8011 67.902 24 72 C 38 75 43.8361 61.5024 48.4697 58.2291 C 56.1228 52.8192 61.0332 48.3903 68 36 C 61.0332 33.5629 49.6004 36.2168 47 29 C 45.052 48.0115 45.1308 55.7689 48.3249 59.6529 C 52.1983 64.3648 60.7542 65.1416 65.9734 60.5723 C 71.2586 55.9434 75.0191 49.1011 93 44 C 85.5086 32.9925 98.3787 17.516 95.1207 5.5723 C 94.6778 3.9485 93.2681 2.7077 91.5859 2.6417 C 83.3153 2.3204 80.8068 20.2891 64 23 C 78.0258 33.1968 72.9983 54.7942 78.9478 61.5513 C 85.6171 69.1108 94.5308 55.0261 98.4426 48.4861 C 99.2943 47.1325 100.131 45.6683 124 27 C 108.38 33.001 121.251 17.5245 117.99 5.5808 C 117.55 3.957 116.14 2.7162 114.458 2.6503 C 106.187 2.3289 103.679 20.2976 96 26 C 100.896 33.2053 95.8702 54.8027 101.82 61.5598 C 108.487 69.1193 119.255 55.6923 129 50 C 124.566 38.7494 131.721 35.6975 140.232 37.5512 C 130.669 34.6504 123.186 41.6757 112 45 C 120.194 53.862 121.623 59.2315 127.102 62.1281 C 141.857 69.9259 157.67 44.2339 140 19 C 136.561 37.8917 134.96 42.7611 136.48 47.6582 C 138.822 55.3603 149.469 56.2754 155.6 53.6641";

describe("Path Interpolation", () => {
  it("Can interpolate", () => {
    const path1 = CanvasKit.Path.MakeFromSVGString(hello1)!;
    const path2 = CanvasKit.Path.MakeFromSVGString(hello2)!;
    expect(path1).toBeTruthy();
    expect(path2).toBeTruthy();
    expect(CanvasKit.Path.CanInterpolate(path1, path2)).toBe(true);
  });
  it("Cannot interpolate", () => {
    const path1 = CanvasKit.Path.MakeFromSVGString(hello1)!;
    const path2 = CanvasKit.Path.MakeFromSVGString(hello3)!;
    expect(path1).toBeTruthy();
    expect(path2).toBeTruthy();
    expect(CanvasKit.Path.CanInterpolate(path1, path2)).toBe(false);
  });
  it("MakeFromCmd", () => {
    const path1 = CanvasKit.Path.MakeFromSVGString(hello1)!;
    const cmd = path1.toCmds();
    const path2 = CanvasKit.Path.MakeFromCmds(cmd)!;
    expect(path1).toBeTruthy();
    expect(path2).toBeTruthy();
    expect(path1.toCmds()).toBeApproximatelyEqual(path2.toCmds());
  });

  it("basic interpolation", () => {
    const path2 = new CanvasKit.Path();
    path2.moveTo(0, 0);
    path2.lineTo(20, 20);
    path2.lineTo(20, 40);
    const path = new CanvasKit.Path();
    path.moveTo(20, 20);
    path.lineTo(20, 40);
    path.lineTo(40, 20);
    expect(CanvasKit.Path.CanInterpolate(path, path2)).toBe(true);
    expect(
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 0.5)!.toSVGString()
    ).toBe("M10 10 L20 30 L30 30");

    const path2Ref = new RealCanvasKit.Path();
    path2Ref.moveTo(0, 0);
    path2Ref.lineTo(20, 20);
    path2Ref.lineTo(20, 40);
    const pathRef = new RealCanvasKit.Path();
    pathRef.moveTo(20, 20);
    pathRef.lineTo(20, 40);
    pathRef.lineTo(40, 20);
    const ref = RealCanvasKit.Path.MakeFromPathInterpolation(
      pathRef,
      path2Ref,
      0
    )!;
    expect(ref).toBeTruthy();
    expect(
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 0)!.toCmds()
    ).toEqual(ref.toCmds());
  });
  it("interpolation values can overshoot", async () => {
    const path2 = new CanvasKit.Path();
    path2.moveTo(0, 0);
    path2.lineTo(20, 20);
    path2.lineTo(20, 40);
    const path = new CanvasKit.Path();
    path.moveTo(20, 20);
    path.lineTo(20, 40);
    path.lineTo(40, 20);
    //path.trim(0, 1, false);
    const path2Ref = new RealCanvasKit.Path();
    path2Ref.moveTo(0, 0);
    path2Ref.lineTo(20, 20);
    path2Ref.lineTo(20, 40);
    const pathRef = new RealCanvasKit.Path();
    pathRef.moveTo(20, 20);
    pathRef.lineTo(20, 40);
    pathRef.lineTo(40, 20);
    // pathRef.trim(0, 1, false);
    const refs = [
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        -1
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        0
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        0.0001
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        1
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        1.0001
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        1.2
      )!.toCmds(),
      RealCanvasKit.Path.MakeFromPathInterpolation(
        pathRef,
        path2Ref,
        2
      )!.toCmds(),
    ];
    const results = [
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, -1)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 0)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 0.0001)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 1)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 1.0001)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 1.2)!.toCmds(),
      CanvasKit.Path.MakeFromPathInterpolation(path, path2, 2)!.toCmds(),
    ];
    expect(results.map((f) => Array.from(f)).flat()).toBeApproximatelyEqual(
      refs.map((f) => Array.from(f)).flat()
    );
  });
});
