import { IError } from "../types";

export class ApiError extends Error implements IError {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "true";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
