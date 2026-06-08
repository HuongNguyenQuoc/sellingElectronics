export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor); // (this, this.constructor) -> (objectCanStoreError, functionToIgnore)
    /*
      Error.captureStackTrace is used save stack trace.
      Ex: AppError
        at UserService.register
        at UserController.register
    */
  }
}
