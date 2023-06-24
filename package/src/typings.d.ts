/* eslint-disable import/no-default-export */
type ABSCommand = "A" | "C" | "H" | "L" | "M" | "Q" | "S" | "T" | "V" | "Z";
type NormalizedCommand = "C" | "L" | "M" | "Q" | "Z";

declare module "parse-svg-path" {
  export default function (path: string): [string, ...number[]][];
}

declare module "abs-svg-path" {
  export default function (
    path: [string, ...number[]][]
  ): [ABSCommand, ...number[]][];
}

declare module "normalize-svg-path" {
  export default function (
    path: [ABSCommand, ...number[]][]
  ): [NormalizedCommand, ...number[]][];
}

declare module "serialize-svg-path" {
  export default function (path: [string, ...number[]][]): string;
}
