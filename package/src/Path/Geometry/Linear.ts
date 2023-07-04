export const linearSolve = (t: number, p0: number, p1: number) => {
  return p0 + t * (p1 - p0);
};
