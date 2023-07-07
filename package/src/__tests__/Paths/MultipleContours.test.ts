/* eslint-disable max-len */
import "../setup";

import { prepareMultipleContourTest, multipleContours } from "./setup";
/* Straight lines:
  "M0 0 L200 200 M 200 200 L 640.48 1285.21 Q 642.39 644.73 642.39 644.73",
  "M0 0 L200 200 L 640.48 1285.21 Q 642.39 644.73 642.39 644.73"
*/
const paths = [
  "M 0 0 Q 300 0 642.39 644.73",
  "M 0 0 L 200 200 M 382 741 L 640.48 1285.21 Q 1179 566 642.39 644.73",
  "M 0 0 L 200 200 M 200 200 L 640.48 1285.21 Q 1156 894 642.39 644.73",
  "M38 544.361C38 544.361 120.639 454.303 190.648 373.501C313.125 232.185 447.108 67.1429 333.239 39.5025C291.865 29.4455 260.181 71.9443 240.5 105.359C159.266 242.891 134.027 470.87 132.967 661.714C155.049 595.23 234.379 420.088 311.698 424.911C400.998 430.469 322.685 564.389 342.733 622.395C373.704 704.126 458.852 640.649 505.914 607.385C583.644 552.407 633.517 507.399 633.517 440.851C633.517 356.718 517.398 383.688 491.467 450.994C471.202 503.55 472.002 582.383 504.443 621.854C543.784 669.738 630.684 677.632 683.693 631.197C737.373 584.157 775.567 514.623 805.889 468.058C882.105 350.922 1012.82 193.644 979.732 72.2687C975.234 55.7667 960.916 43.1576 943.83 42.4871C859.828 39.2213 834.351 221.825 820.315 286.99C806.105 352.998 755.043 572.478 815.47 641.146C883.208 717.968 973.741 574.835 1013.47 508.373C1022.12 494.617 1030.62 479.737 1038.17 468.145C1114.41 351.008 1245.12 193.731 1212.01 72.3552C1207.54 55.8531 1193.22 43.2441 1176.13 42.5736C1092.13 39.3078 1066.65 221.912 1052.62 287.076C1038.39 353.085 987.345 572.564 1047.77 641.233C1115.49 718.055 1224.86 581.605 1247.01 510.946C1278.8 409.425 1351.47 378.411 1437.91 397.249C1340.78 367.77 1264.78 439.164 1247.01 511.595C1234.4 563.005 1248.91 617.572 1304.56 647.007C1454.42 726.252 1615.02 465.16 1437.91 397.249C1400.63 400.709 1384.36 450.194 1399.81 499.96C1423.6 578.231 1531.73 587.531 1594 560.993",
  "M5 195.506C5 195.506 740.428 -53.3713 910 33.3439C1079.57 120.059 623.117 596.047 459.015 785.994C294.913 975.941 459.015 1207.18 710.638 1244.34",
];
beforeAll(() => {
  for (const d of paths) {
    multipleContours[d] = prepareMultipleContourTest(d);
  }
});

const tolerance = 4;
describe("Multiple contour values", () => {
  test.each(paths)("%s: getTotalLength()", (d) => {
    const [reference, test] = multipleContours[d];
    expect(reference.length).toBeApproximatelyEqual(test.length, tolerance);
  });
  const dt = paths.flatMap((d) => [
    [d, 0.1],
    [d, 0.3],
    [d, 0.5],
    [d, 0.7],
    [d, 0.9],
  ]) as [string, number][];
  test.each(dt)("%s: posTan(%d)", (d, t) => {
    const [reference, test] = multipleContours[d];
    for (let i = 0; i < reference.contours.length; i++) {
      const contourRef = reference.contours[i];
      const contour = test.contours[i];
      expect(contourRef.length()).toBeApproximatelyEqual(
        contour.length(),
        tolerance
      );
      const length = t * contourRef.length();
      const posTanRef = contourRef.getPosTan(length);
      const posTan = contour.getPosTan(length);
      expect(posTanRef).toBeApproximatelyEqual(posTan, tolerance);
    }
  });
  const ranges = paths.flatMap((d) => [
    [d, 0, 0.1],
    [d, 0, 0.5],
    [d, 0, 0.6],
  ]) as [string, number, number][];
  test.each(ranges)("%s: trim(%d, %d)", (d, t0, t1) => {
    const [reference, test] = multipleContours[d];
    const pathRef = reference.trim(t0, t1)!;
    const path = test.trim(t0, t1)!;
    expect(pathRef).toBeTruthy();
    expect(path).toBeTruthy();
    expect(pathRef.toCmds()).toBeApproximatelyEqual(path.toCmds(), tolerance);
  });
});
