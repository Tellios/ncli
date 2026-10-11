export class UnreachableCaseError extends Error {
  constructor(value: never) {
    super(`Unreachable case encountered with value: ${value}`);
    Object.setPrototypeOf(this, UnreachableCaseError.prototype);
  }
}
