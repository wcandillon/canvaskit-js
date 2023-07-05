import "../setup";
import { prepareSingleContourTest, singleContours } from "./setup";

const paths = [
  "M0 0 L200 200",
  "M 640.48 1285.21 Q 642.39 644.73 642.39 644.73",
  "M0 0 Q 0 200 200 200",
  //"M 267 0 Q 382 0 512 0",
  //"M 267 0 Q 383 265 512 0",
  "M200 200 C 275 100 575 100 500 200",
  "M0 0 C 0 200 0 200 200 200",
];

beforeAll(() => {
  for (const d of paths) {
    singleContours[d] = prepareSingleContourTest(d);
  }
});

describe("Single contour values", () => {
  test.each(paths)("Check path length: %s", (d) => {
    const [reference, test] = singleContours[d];
    const length = reference.getTotalLength();
    expect(length).toBeApproximatelyEqual(test.getTotalLength(), 3);
  });
});
