// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./jest.d.ts" />

import { diff } from "jest-diff";

expect.extend({
  toBeApproximatelyEqual(received, argument, tolerance = 0.1) {
    if (received.length !== argument.length) {
      return { pass: false, message: () => "Arrays have different lengths" };
    }
    for (let i = 0; i < received.length; i++) {
      if (Math.abs(received[i] - argument[i]) > tolerance) {
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
