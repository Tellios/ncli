export class UnreachableCaseError extends Error {
  constructor(value: never) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    super(`Unreachable case encountered with value: ${value}`);
    Object.setPrototypeOf(this, UnreachableCaseError.prototype);
  }
}
