import { useMemo } from "react";

import { Easing } from "./Easing";

export const startAnimations = (
  values: AnimationValue[],
  redraw: () => void
) => {
  requestAnimationFrame((time) => {
    let shouldRedraw = false;
    values.forEach((value) => {
      const hasChanged = value.onFrame(time);
      if (hasChanged) {
        shouldRedraw = true;
      }
    });
    if (shouldRedraw) {
      redraw();
    }
    startAnimations(values, redraw);
  });
};

const easing = Easing.inOut(Easing.ease);

export abstract class AnimationValue {
  constructor(protected _value: number) {}

  get value() {
    return this._value;
  }

  abstract onFrame(timespace: number): boolean;
}

class LoopAnimationValue extends AnimationValue {
  private start: number | null = null;
  private duration: number;

  constructor(value: number, duration: number) {
    super(value);
    this.duration = duration;
  }

  onFrame(timestamp: number) {
    if (this.start === null) {
      this.start = timestamp;
    }
    const elapsed = timestamp - this.start;

    const iterations = Math.floor(elapsed / this.duration);
    const shouldReverse = iterations % 2 === 0;
    const value = easing((elapsed % this.duration) / this.duration); // Value from 0 to 1 over the duration
    this._value = shouldReverse ? 1 - value : value;

    return true;
  }
}

export const useLoop = (value = 0, duration = 3000) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => new LoopAnimationValue(value, duration), []);
