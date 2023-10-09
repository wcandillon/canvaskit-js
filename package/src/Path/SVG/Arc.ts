/* eslint-disable camelcase */
"use strict";

const TAU: number = Math.PI * 2;

const unitVectorAngle = (ux: number, uy: number, vx: number, vy: number) => {
  const sign: number = ux * vy - uy * vx < 0 ? -1 : 1;
  let dot: number = ux * vx + uy * vy;

  if (dot > 1.0) {
    dot = 1.0;
  }
  if (dot < -1.0) {
    dot = -1.0;
  }

  return sign * Math.acos(dot);
};

const getArcCenter = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  fa: number,
  fs: number,
  rx: number,
  ry: number,
  sin_phi: number,
  cos_phi: number
) => {
  const x1p: number = (cos_phi * (x1 - x2)) / 2 + (sin_phi * (y1 - y2)) / 2;
  const y1p: number = (-sin_phi * (x1 - x2)) / 2 + (cos_phi * (y1 - y2)) / 2;

  const rx_sq: number = rx * rx;
  const ry_sq: number = ry * ry;
  const x1p_sq: number = x1p * x1p;
  const y1p_sq: number = y1p * y1p;

  let radicant: number = rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq;

  if (radicant < 0) {
    radicant = 0;
  }

  radicant /= rx_sq * y1p_sq + ry_sq * x1p_sq;
  radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

  const cxp: number = ((radicant * rx) / ry) * y1p;
  const cyp: number = ((radicant * -ry) / rx) * x1p;

  const cx: number = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2;
  const cy: number = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2;

  const v1x: number = (x1p - cxp) / rx;
  const v1y: number = (y1p - cyp) / ry;
  const v2x: number = (-x1p - cxp) / rx;
  const v2y: number = (-y1p - cyp) / ry;

  const theta1: number = unitVectorAngle(1, 0, v1x, v1y);
  let delta_theta: number = unitVectorAngle(v1x, v1y, v2x, v2y);

  if (fs === 0 && delta_theta > 0) {
    delta_theta -= TAU;
  }
  if (fs === 1 && delta_theta < 0) {
    delta_theta += TAU;
  }

  return [cx, cy, theta1, delta_theta];
};

const approximate_unit_arc = (
  theta1: number,
  delta_theta: number
): number[] => {
  const alpha: number = (4 / 3) * Math.tan(delta_theta / 4);

  const x1: number = Math.cos(theta1);
  const y1: number = Math.sin(theta1);
  const x2: number = Math.cos(theta1 + delta_theta);
  const y2: number = Math.sin(theta1 + delta_theta);

  return [
    x1,
    y1,
    x1 - y1 * alpha,
    y1 + x1 * alpha,
    x2 + y2 * alpha,
    y2 - x2 * alpha,
    x2,
    y2,
  ];
};

export const a2c = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  fa: number,
  fs: number,
  rx: number,
  ry: number,
  phi: number
): number[][] => {
  const sin_phi: number = Math.sin((phi * TAU) / 360);
  const cos_phi: number = Math.cos((phi * TAU) / 360);

  const x1p: number = (cos_phi * (x1 - x2)) / 2 + (sin_phi * (y1 - y2)) / 2;
  const y1p: number = (-sin_phi * (x1 - x2)) / 2 + (cos_phi * (y1 - y2)) / 2;

  if (x1p === 0 && y1p === 0) {
    return [];
  }

  if (rx === 0 || ry === 0) {
    return [];
  }

  rx = Math.abs(rx);
  ry = Math.abs(ry);

  const lambda: number = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }

  const cc: number[] = getArcCenter(
    x1,
    y1,
    x2,
    y2,
    fa,
    fs,
    rx,
    ry,
    sin_phi,
    cos_phi
  );

  const result: number[][] = [];
  let theta1: number = cc[2];
  let delta_theta: number = cc[3];

  const segments: number = Math.max(
    Math.ceil(Math.abs(delta_theta) / (TAU / 4)),
    1
  );
  delta_theta /= segments;

  for (let i = 0; i < segments; i++) {
    result.push(approximate_unit_arc(theta1, delta_theta));
    theta1 += delta_theta;
  }

  return result.map((curve: number[]): number[] => {
    for (let i = 0; i < curve.length; i += 2) {
      let x: number = curve[i + 0];
      let y: number = curve[i + 1];

      x *= rx;
      y *= ry;

      const xp: number = cos_phi * x - sin_phi * y;
      const yp: number = sin_phi * x + cos_phi * y;

      curve[i + 0] = xp + cc[0];
      curve[i + 1] = yp + cc[1];
    }

    return curve;
  });
};
