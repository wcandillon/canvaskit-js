import parseSVG from "parse-svg-path";
import absSVG from "abs-svg-path";
import normalizeSVG from "normalize-svg-path";

import { vec } from "../Vector";
import { PathVerb } from "../Core";

import type { Path } from "./Path";
import { PathBuilder } from "./PathBuilder";

export const toSVGString = (path: Path) => {
  const cmds = path.toCmds();
  return cmds
    .map((cmd) => {
      if (cmd[0] === PathVerb.Move) {
        return `M${cmd[1]} ${cmd[2]}`;
      } else if (cmd[0] === PathVerb.Line) {
        return `L${cmd[1]} ${cmd[2]}`;
      } else if (cmd[0] === PathVerb.Cubic) {
        return `C${cmd[1]} ${cmd[2]} ${cmd[3]} ${cmd[4]} ${cmd[5]} ${cmd[6]}`;
      } else if (cmd[0] === PathVerb.Quad) {
        return `Q${cmd[1]} ${cmd[2]} ${cmd[3]} ${cmd[4]}`;
      } else if (cmd[0] === PathVerb.Close) {
        return "Z";
      }
      return " ";
    })
    .join(" ");
};

export const fromSVGString = (d: string) => {
  const parsed = normalizeSVG(absSVG(parseSVG(d)));
  const path = new PathBuilder();
  parsed.forEach((cmd) => {
    switch (cmd[0]) {
      case "M":
        path.moveTo(vec(cmd[1], cmd[2]));
        break;
      case "L":
        path.lineTo(vec(cmd[1], cmd[2]));
        break;
      case "C":
        path.cubicCurveTo(
          vec(cmd[1], cmd[2]),
          vec(cmd[3], cmd[4]),
          vec(cmd[5], cmd[6])
        );
        break;
      case "Q":
        path.quadraticCurveTo(vec(cmd[1], cmd[2]), vec(cmd[3], cmd[4]));
        break;
      case "Z":
        path.close();
        break;
      default:
        throw new Error(`Unsupported command: ${cmd[0]}`);
    }
  });
  return path;
};
