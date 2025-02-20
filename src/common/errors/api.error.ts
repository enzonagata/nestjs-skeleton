export class ApiError extends Error {
  constructor(
    public readonly message: string,
    public readonly details: Record<string, unknown>,
  ) {
    super(message);
  }
}
