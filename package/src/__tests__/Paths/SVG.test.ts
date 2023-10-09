/* eslint-disable max-len */
import { processResult, setupRealSkia } from "../setup";

describe("PathKit's SVG Behavior", () => {
  it("can create a path from an SVG string", () => {
    //.This is a parallelagram from
    // https://upload.wikimedia.org/wikipedia/commons/e/e7/Simple_parallelogram.svg
    const path = CanvasKit.Path.MakeFromSVGString(
      "M 205,5 L 795,5 L 595,295 L 5,295 L 205,5 z"
    )!;
    expect(path).toBeTruthy();
    const cmds = path.toCmds();
    expect(cmds).toBeTruthy();
    // 1 move, 4 lines, 1 close
    // each element in cmds is an array, with index 0 being the verb, and the rest being args
    expect(cmds).toEqual(
      new Float32Array(
        [
          [CanvasKit.MOVE_VERB, 205, 5],
          [CanvasKit.LINE_VERB, 795, 5],
          [CanvasKit.LINE_VERB, 595, 295],
          [CanvasKit.LINE_VERB, 5, 295],
          [CanvasKit.LINE_VERB, 205, 5],
          [CanvasKit.CLOSE_VERB],
        ].flat()
      )
    );
  });

  it("can create an SVG string from a path", () => {
    const cmds = [
      [CanvasKit.MOVE_VERB, 205, 5],
      [CanvasKit.LINE_VERB, 795, 5],
      [CanvasKit.LINE_VERB, 595, 295],
      [CanvasKit.LINE_VERB, 5, 295],
      [CanvasKit.LINE_VERB, 205, 5],
      [CanvasKit.CLOSE_VERB],
    ];
    const path = CanvasKit.Path.MakeFromCmds(cmds.flat())!;
    expect(path).toBeTruthy();

    const svgStr = path.toSVGString();
    // We output it in terse form, which is different than Wikipedia's version
    expect(svgStr).toEqual("M205 5 L795 5 L595 295 L5 295 L205 5 Z");
  });

  it("should have input and the output be the same", () => {
    const testCases = ["M0 0 L1075 0 L1075 242 L0 242 L0 0 Z"];

    for (const svg of testCases) {
      const path = CanvasKit.Path.MakeFromSVGString(svg)!;
      expect(path).toBeTruthy();
      const output = path.toSVGString();

      expect(svg).toEqual(output);

      path.delete();
    }
  });

  it("approximates arcs reference", () => {
    const { surface, canvas } = setupRealSkia();
    const path = new RealCanvasKit.Path();
    path.moveTo(50, 120);
    path.arc(50, 120, 45, 0, 1.75 * Math.PI);
    path.lineTo(50, 120);
    const paint = new RealCanvasKit.Paint();
    canvas.drawPath(path, paint);
    processResult(surface, "snapshots/arc.png");
  });

  // TODO:
  // check that the scaled path is the same than the one done via canvas or path.transform
  // it("draw the Skia logo", async () => {
  //   const image = await skia.eval(({ CanvasKit, canvas }) => {
  //     const path = CanvasKit.Path.MakeFromSVGString(
  //       // eslint-disable-next-line max-len
  //       "M512.213 204.005C500.312 185.697 406.758 105.581 332.94 105.581C259.122 105.581 219.088 132 204.638 149.85C157.952 207.52 141.933 264.275 156.579 320.115C175.803 387.854 228.896 449.644 315.859 505.483C415.638 562.238 479.716 626.774 508.093 699.091C518.163 731.13 519.536 762.711 512.213 793.835C504.889 824.959 490.243 853.336 468.273 878.967C449.965 903.683 425.707 921.534 395.499 932.518C365.291 942.588 328.675 950.369 285.651 955.861C182.21 964.1 97.9935 948.538 33 909.176M595.972 733.419C710.397 564.985 795.529 424.47 851.369 311.876C865.1 279.837 875.169 255.579 881.577 239.102C887.985 221.709 894.393 198.824 900.801 170.447C907.208 142.069 909.497 115.98 907.666 92.1797C904.92 68.3793 893.02 51.9021 871.965 40.0019C850.911 28.1016 835.5 31.3101 811.549 44.1212C772.187 65.1754 745.64 101.334 731.909 152.596C723.67 174.566 715.432 200.197 707.193 229.49C699.87 258.783 694.378 281.21 690.716 296.772C687.97 312.334 682.935 340.711 675.612 381.904C668.289 422.182 663.712 445.982 661.881 453.306C643.573 567.731 621.603 733.876 595.972 951.742C624.349 852.878 656.846 774.154 693.462 715.568C706.278 689.937 717.263 669.798 726.417 655.152C735.571 640.505 748.844 624.486 766.237 607.093C784.545 589.701 803.768 576.885 823.907 568.646C892.562 543.015 941.994 545.304 972.202 575.512C990.51 594.735 999.664 618.078 999.664 645.54C1000.58 673.002 990.052 694.514 968.083 710.076C925.059 733.876 859.608 741.657 771.729 733.419C786.375 737.996 797.36 742.115 804.683 745.776C812.922 748.523 822.992 753.1 834.892 759.508C847.707 765.915 857.319 773.696 863.727 782.85C871.05 792.004 875.627 802.531 877.458 814.432C878.373 819.009 879.746 827.705 881.577 840.521C884.323 853.336 886.612 862.948 888.443 869.356C890.273 875.763 892.562 884.002 895.308 894.072C898.97 904.141 903.089 912.837 907.666 920.16C913.159 926.568 919.566 932.976 926.89 939.384C949.775 961.354 987.764 958.607 1040.86 931.145C1056.42 923.822 1070.61 914.668 1083.42 903.683C1097.15 892.698 1109.97 879.425 1121.87 863.863C1134.69 847.386 1144.76 834.113 1152.08 824.043C1159.4 813.058 1169.47 797.039 1182.29 775.985C1195.1 754.931 1204.26 740.742 1209.75 733.419C1239.04 674.833 1268.33 616.247 1297.63 557.661C1252.77 670.256 1223.94 756.304 1211.12 815.805C1205.63 833.197 1203.34 853.336 1204.26 876.221C1205.17 899.106 1212.04 917.414 1224.85 931.145C1234.01 942.13 1245.45 949.453 1259.18 953.115C1273.83 956.777 1287.56 956.319 1300.37 951.742C1356.21 935.265 1401.53 903.226 1436.31 855.625C1456.45 828.163 1483.45 787.427 1517.32 733.419M1360.79 390.143C1347.97 390.143 1340.19 384.193 1337.45 372.293C1335.62 359.477 1336.99 348.492 1341.57 339.338C1345.24 332 1357.13 333.846 1369.03 333.846C1380.93 333.846 1390.5 340.5 1391 348.95M1925.13 697.718C1902.25 633.64 1874.33 593.82 1841.38 578.258C1810.25 559.95 1775.47 551.254 1737.02 552.169C1698.57 552.169 1664.25 562.238 1634.04 582.377C1605.66 598.855 1581.4 620.824 1561.26 648.286C1541.12 674.833 1527.39 704.126 1520.07 736.165C1513.66 767.288 1514.58 798.87 1522.82 830.909C1531.97 862.032 1547.53 888.579 1569.5 910.549C1604.29 939.842 1646.4 954.488 1695.83 954.488C1745.26 954.488 1787.82 939.842 1823.53 910.549C1838.17 895.902 1848.7 885.375 1855.11 878.967C1861.51 872.56 1868.84 863.406 1877.08 851.505C1886.23 839.605 1893.55 827.247 1899.05 814.432M1958.09 556.288C1933.37 657.898 1916.9 746.234 1908.66 821.297C1900.42 878.967 1911.4 918.787 1941.61 940.757C1964.5 959.065 2000.2 956.319 2048.71 932.518C2090.82 912.38 2131.1 873.017 2169.55 814.432"
  //     )!;
  //     //const m = CanvasKit.Matrix.scaled(1, 1);
  //     //path.transform(m);
  //     const paint = new CanvasKit.Paint();
  //     paint.setStyle(CanvasKit.PaintStyle.Stroke);
  //     paint.setStrokeWidth(15);
  //     const colors = [
  //       "#3FCEBC",
  //       "#3CBCEB",
  //       "#5F96E7",
  //       "#816FE3",
  //       "#9F5EE2",
  //       "#DE589F",
  //       "#FF645E",
  //       "#FDA859",
  //       "#FAEC54",
  //       "#9EE671",
  //       "#41E08D",
  //     ].map((c) => CanvasKit.parseColorString(c));
  //     paint.setShader(
  //       CanvasKit.Shader.MakeLinearGradient(
  //         [0, 0],
  //         [256, 256],
  //         colors,
  //         null,
  //         CanvasKit.TileMode.Clamp
  //       )
  //     );
  //     canvas.save();
  //     canvas.scale(0.2, 0.2);
  //     canvas.drawPath(path, paint);
  //     canvas.restore();
  //   });
  //   checkImage(image, "snapshots/skia_logo.png", { overwrite: true });
  // });

  // it("approximates arcs", () => {
  //   const { surface, canvas } = setupSkia();
  //   const path = new CanvasKit.Path();
  //   path.moveTo(50, 120);
  //   path.arc(50, 120, 45, 0, 1.75 * Math.PI);
  //   path.lineTo(50, 120);
  //   const paint = new CanvasKit.Paint();
  //   canvas.drawPath(path, paint);
  //   processResult(surface, "snapshots/arc.png");
  // });
});
