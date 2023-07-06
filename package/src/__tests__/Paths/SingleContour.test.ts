import "../setup";

import { prepareSingleContourTest, singleContours } from "./setup";

// Multi contour paths
//"M 100 200 C 100 100 250 100 250 200 C 250 300 400 300 400 200",
//"M100,200 C100,100 250,100 250,200 S400,300 400,200",

const paths = [
  "M0 0 L200 200",
  // "M 640.48 1285.21 Q 642.39 644.73 642.39 644.73",
  // "M0 0 Q 0 200 200 200",
  // "M 267 0 Q 382 0 512 0",
  // "M 267 0 Q 383 265 512 0",
  // "M200 200 C 275 100 575 100 500 200",
  // "M0 0 C 0 200 0 200 200 200",
];

beforeAll(() => {
  for (const d of paths) {
    singleContours[d] = prepareSingleContourTest(d);
  }
});

describe("Single contour values", () => {
  test.each(paths)("%s: getTotalLength()", (d) => {
    const [reference, test] = singleContours[d];
    const length = reference.length();
    expect(length).toBeApproximatelyEqual(test.length(), 1);
  });
  const dt = paths.flatMap((d) => [
    [d, 0.1],
    [d, 0.33],
    [d, 0.5],
    [d, 0.66],
  ]) as [string, number][];
  test.each(dt)("%s: posTan(%d)", (d, t) => {
    const [reference, test] = singleContours[d];
    const length = t * reference.length();
    const posTanRef = reference.getPosTan(length);
    const posTan = test.getPosTan(length);
    expect(posTanRef).toBeApproximatelyEqual(posTan, 1);
  });
  const ranges = paths.flatMap((d) => [
    [d, 0, 0.25],
    [d, 0.3, 0.5],
    [d, 0.5, 1],
    [d, 0, 0.5],
  ]) as [string, number, number][];
  test.each(ranges)("%s: trim(%d, %d)", (d, t0, t1) => {
    const [reference, test] = singleContours[d];
    const start = t0 * reference.length();
    const end = t1 * reference.length();
    const pathRef = reference.getSegment(start, end, true);
    const path = test.getSegment(start, end, true);
    expect(pathRef.toCmds()).toBeApproximatelyEqual(path.toCmds(), 1);
  });
});
