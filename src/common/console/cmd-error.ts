export class CmdError extends Error {
  constructor(
    public exitCode: number,
    public processMessage: string,
    public stdout: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
