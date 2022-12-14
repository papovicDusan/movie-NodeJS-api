import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";

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

  return res.status(500).json({ message: "Something went wrong" });
};
