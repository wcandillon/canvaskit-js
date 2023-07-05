// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./jest.d.ts" />

import { diff } from "jest-diff";

expect.extend({
  toBeApproximatelyEqual(_received, _argument, tolerance = 0.1) {
    const received =
      Array.isArray(_received) || _received instanceof Float32Array
        ? _received
        : [_received];
    const argument =
      Array.isArray(_argument) || _received instanceof Float32Array
        ? _argument
        : [_argument];
    if (received.length !== argument.length) {
      return { pass: false, message: () => "Arrays have different lengths" };
    }
    for (let i = 0; i < received.length; i++) {
      if (
        isNaN(argument[i]) ||
        isNaN(received[i]) ||
        Math.abs(received[i] - argument[i]) > tolerance
      ) {
        const diffString = diff(received, argument);
        return {
          pass: false,
          message: () => `Element at index ${i} differ more than ${tolerance}:
${diffString}`,
        };
      }
    }
    return { pass: true, message: () => "Arrays are approximately equal" };
  },
});
