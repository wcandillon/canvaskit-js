import "../setup";
import { svgPathProperties } from "svg-path-properties";

import { prepareSingleContourTest, singleContours } from "./setup";

// Multi contour paths
//"M 100 200 C 100 100 250 100 250 200 C 250 300 400 300 400 200",
//"M100,200 C100,100 250,100 250,200 S400,300 400,200",

const paths = [
  "M0 0 L200 200",
  "M 640.48 1285.21 Q 642.39 644.73 642.39 644.73",
  "M0 0 Q 0 200 200 200",
  "M 267 0 Q 382 0 512 0",
  "M 267 0 Q 383 265 512 0",
  "M200 200 C 275 100 575 100 500 200",
  "M0 0 C 0 200 0 200 200 200",
];

beforeAll(() => {
  for (const d of paths) {
    singleContours[d] = prepareSingleContourTest(d);
  }
});

describe("Single contour values", () => {
  test.each(paths)("%s: getTotalLength()", (d) => {
    const [reference, test] = singleContours[d];
    const length = reference.getTotalLength();
    expect(length).toBeApproximatelyEqual(test.getTotalLength(), 1);
  });
  const dt = paths.flatMap((d) => [
    [d, 0.3],
    [d, 0.5],
    [d, 0.7],
  ]) as [string, number][];
  test.each(dt)("%s: posTan(%d)", (d, t) => {
    const [reference] = singleContours[d];
    const length = t * reference.getTotalLength();
    const posTanRef = reference.getPosTan(length);
    // const posTan = test.getPosTan(length);
    //expect(posTanRef).toBeApproximatelyEqual(posTan, 1);
    const props = new svgPathProperties(d);
    const pos = props.getPointAtLength(length);
    const tan = props.getTangentAtLength(length);
    expect(pos.x).toBeApproximatelyEqual(posTanRef[0], 1);
    expect(pos.y).toBeApproximatelyEqual(posTanRef[1], 1);
    expect(tan.x).toBeApproximatelyEqual(posTanRef[2], 1);
    expect(tan.y).toBeApproximatelyEqual(posTanRef[3], 1);
  });
});
