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

type PathCommand = [Command, ...number[]];

export const parseSVG = (svgString: string): PathCommand[] => {
  // RegExp to match segments and numbers
  const segment = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
  const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;

  // Array to store the commands
  const commands: PathCommand[] = [];

  let match;
  while ((match = segment.exec(svgString)) !== null) {
    // Get the command letter
    const command = match[1] as Command;

    // Get the numbers
    const params = [];
    let numMatch;
    while ((numMatch = number.exec(match[2])) !== null) {
      params.push(parseFloat(numMatch[0]));
    }

    // overloaded moveTo
    if ((command === "m" || command === "M") && params.length > 2) {
      commands.push([command, ...params.splice(0, 2)]);
      const lineTo = command === "m" ? "l" : "L";
      while (params.length > 0) {
        commands.push([lineTo, ...params.splice(0, 2)]);
      }
    } else {
      // Push to the commands array
      commands.push([command, ...params]);
    }
  }

  return commands;
};
