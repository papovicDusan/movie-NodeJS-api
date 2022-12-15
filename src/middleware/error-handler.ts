import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong" });
};
