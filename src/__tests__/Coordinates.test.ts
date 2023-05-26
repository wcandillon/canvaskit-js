import { vec } from "../Values";
import {
  canvas2Cartesian,
  cartesian2Canvas,
  cartesian2Polar,
  polar2Cartesian,
} from "../math";

test("canvas2Cartesian 1", () => {
  const point = canvas2Cartesian(vec(500, 200), vec(500, 200));
  expect(point[0]).toBe(0);
  expect(point[1]).toBe(-0);
});
test("canvas2Cartesian 2", () => {
  const point = canvas2Cartesian(vec(0, 0), vec(500, 200));
  expect(point[0]).toBe(-500);
  expect(point[1]).toBe(200);
});

test("canvas2Cartesian 3", () => {
  const point = canvas2Cartesian(vec(600, 300), vec(500, 200));
  expect(point[0]).toBe(100);
  expect(point[1]).toBe(-100);
});

test("cartesian2Canvas 1", () => {
  const point = cartesian2Canvas(vec(0, 0), vec(500, 200));
  expect(point[0]).toBe(500);
  expect(point[1]).toBe(200);
});

test("cartesian2Canvas 2", () => {
  const point = cartesian2Canvas(vec(-500, 200), vec(500, 200));
  expect(point[0]).toBe(0);
  expect(point[1]).toBe(0);
});

test("cartesian2Canvas 3", () => {
  const point = cartesian2Canvas(vec(100, -100), vec(500, 200));
  expect(point[0]).toBe(600);
  expect(point[1]).toBe(300);
});

test("cartesian2Polar 1", () => {
  const x = 0;
  const y = 100;
  const center = vec(100, 100);
  const { theta, radius } = cartesian2Polar(
    canvas2Cartesian(vec(x, y), center)
  );
  expect(theta).toBe(-Math.PI);
  expect(radius).toBe(100);
  const point = cartesian2Canvas(polar2Cartesian({ theta, radius }), center);
  expect(point[0]).toBe(0);
  expect(Math.round(point[1])).toBe(100);
});
