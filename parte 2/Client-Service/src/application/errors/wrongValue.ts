export class WrongValueError extends Error {
  constructor(message: string) {
    super(`Not found error: ${message}`);
  }
}
