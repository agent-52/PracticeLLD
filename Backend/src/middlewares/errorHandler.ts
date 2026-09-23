import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const notFoundHandler: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new AppError(
      `Route not found: ${req.method} ${req.originalUrl}`,
      404,
      "ROUTE_NOT_FOUND",
    ),
  );
};

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const isAppError = error instanceof AppError;

  const statusCode = isAppError ? error.statusCode : 500;
  const code = isAppError ? error.code : "INTERNAL_SERVER_ERROR";

  const message =
    isAppError || process.env.NODE_ENV !== "production"
      ? error instanceof Error
        ? error.message
        : "Unknown error"
      : "Something went wrong";

  if (!isAppError && process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};