declare namespace jest {
  interface Matchers<R> {
    toBeApproximatelyEqual: (
      arg: number[] | Float32Array,
      tolerance?: number
    ) => R;
  }
}
