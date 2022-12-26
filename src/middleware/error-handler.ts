import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof NotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }

  if (error instanceof BadRequestError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: error.message,
    });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong" });
};
