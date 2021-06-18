export class WrongArgumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WrongArgumentError';
  }
}
