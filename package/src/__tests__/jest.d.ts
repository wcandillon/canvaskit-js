declare namespace jest {
  interface Matchers<R> {
    toBeApproximatelyEqual: (
      arg: number[] | Float32Array | number,
      tolerance?: number
    ) => R;
  }
}
