/* eslint-disable import/no-default-export */
declare module "parse-svg-path" {
  export default function parseSVGPath(path: string): [string, ...number[]][];
}

declare module "abs-svg-path" {
  export default function absSVG(
    path: [string, ...number[]][]
  ): [string, ...number[]][];
}

declare module "serialize-svg-path" {
  export default function serializeSVG(path: [string, ...number[]][]): string;
}
