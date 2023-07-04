declare namespace jest {
  interface Matchers<R> {
    toBeApproximatelyEqual: (arg: number[], tolerance: number) => R;
  }
}
