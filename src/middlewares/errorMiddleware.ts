import { NextFunction, Response, Request } from "express";
import { IError } from "../types";

const sendErrorDev = (err: IError, res: Response) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: IError, res: Response) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    message: err.message,
  });
};

export const globalError = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
