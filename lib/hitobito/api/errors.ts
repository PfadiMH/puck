export class HitobitoError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "HitobitoError";
  }
}

export class UnauthorizedError extends HitobitoError {
  constructor(message = "Unauthorized: Invalid or missing API token") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends HitobitoError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends HitobitoError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

export class ValidationError extends HitobitoError {
  constructor(message: string) {
    super(message, 422);
    this.name = "ValidationError";
  }
}
