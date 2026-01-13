import { NextResponse } from "next/server";

export class ServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  toResponse() {
    return NextResponse.json(
      { error: this.message },
      { status: this.statusCode }
    );
  }
}

export class BadRequestError extends ServiceError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends ServiceError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string = "Not Found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnknownServerError extends ServiceError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
    Object.setPrototypeOf(this, UnknownServerError.prototype);
  }
}
