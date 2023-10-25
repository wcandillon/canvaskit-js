import {
  CubicPathComponent,
  QuadraticPathComponent,
  vec,
  plus,
} from "../../c2d";
import { PathBuilder } from "../PathBuilder";

import { a2c } from "./Arc";

type Command =
  | "a"
  | "c"
  | "h"
  | "l"
  | "m"
  | "q"
  | "s"
  | "t"
  | "v"
  | "z"
  | "A"
  | "C"
  | "H"
  | "L"
  | "M"
  | "Q"
  | "S"
  | "T"
  | "V"
  | "Z";

const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };

const stackCmd = (
  d: string,
  path: PathBuilder,
  cmd: Command,
  params: number[],
  size: number
) => {
  while (params.length > 0) {
    const args = params.splice(0, size);
    if (args.length < size) {
      throw new Error(`malformed path data: ${d}`);
    }
    const lCmd = cmd.toLowerCase();
    const rel = lCmd === cmd;
    const lastPoint = path.getLastPoint();
    const dx = rel ? lastPoint.x : 0;
    const dy = rel ? lastPoint.y : 0;
    const delta = vec(dx, dy);

    if (lCmd === "m") {
      path.moveTo(vec(args[0], args[1]), rel);
    } else if (lCmd === "c") {
      path.cubicCurveTo(
        vec(args[0], args[1]),
        vec(args[2], args[3]),
        vec(args[4], args[5]),
        rel
      );
    } else if (lCmd === "q") {
      path.quadraticCurveTo(vec(args[0], args[1]), vec(args[2], args[3]), rel);
    } else if (lCmd === "l") {
      path.lineTo(vec(args[0], args[1]), rel);
    } else if (lCmd === "h") {
      path.lineTo(vec(dx + args[0], path.getLastPoint().y));
    } else if (lCmd === "v") {
      path.lineTo(vec(path.getLastPoint().x, dy + args[0]));
    } else if (lCmd === "s") {
      const lastComp = path.getPath().getLastComponent();
      const cp2 =
        lastComp instanceof CubicPathComponent ? lastComp.cp2 : lastPoint;
      path.cubicCurveTo(
        cp2,
        plus(delta, vec(args[0], args[1])),
        plus(delta, vec(args[2], args[3]))
      );
    } else if (lCmd === "t") {
      const lastComp = path.getPath().getLastComponent();
      const cp =
        lastComp instanceof QuadraticPathComponent ? lastComp.cp : lastPoint;
      path.quadraticCurveTo(cp, plus(delta, vec(args[2], args[3])));
    } else if (lCmd === "a") {
      const curves = a2c(
        lastPoint.x,
        lastPoint.y,
        dx + args[5],
        dy + args[6],
        args[3],
        args[4],
        args[0],
        args[1],
        args[2]
      );
      for (const curve of curves) {
        path.cubicCurveTo(
          vec(curve[2], curve[3]),
          vec(curve[4], curve[5]),
          vec(curve[6], curve[7])
        );
      }
    }
  }
};

export const parseSVG = (d: string) => {
  const path = new PathBuilder();
  // RegExp to match segments and numbers
  const segment = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
  const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

  let match;
  while ((match = segment.exec(d)) !== null) {
    // Get the command letter
    const command = match[1] as Command;
    const relative = command.toLowerCase() === command;

    // Get the numbers
    const params = [];
    let numMatch;
    while ((numMatch = number.exec(match[2])) !== null) {
      params.push(parseFloat(numMatch[0]));
    }
    const cmdSize = length[command.toLowerCase() as keyof typeof length];

    // overloaded moveTo
    if ((command === "m" || command === "M") && params.length > cmdSize) {
      const args = params.splice(0, cmdSize);
      if (args.length < cmdSize) {
        throw new Error(`malformed path data: ${d}`);
      }
      path.moveTo(vec(args[0], args[1]), relative);
      const lineTo = command === "m" ? "l" : "L";
      stackCmd(d, path, lineTo, params, cmdSize);
    } else if (command === "z" || command === "Z") {
      path.close();
    } else {
      stackCmd(d, path, command, params, cmdSize);
    }
  }
  return path;
};
