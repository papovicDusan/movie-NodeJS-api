import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { StatusCodes } from "http-status-codes";

interface JwtPayload {
  userId: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: AppError = new AppError(
      "Not authenticated.",
      StatusCodes.UNAUTHORIZED
    );
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret") as JwtPayload;
  } catch (error) {
    return next(error);
  }
  if (!decodedToken) {
    const error: AppError = new AppError(
      "Not authenticated.",
      StatusCodes.UNAUTHORIZED
    );
    throw error;
  }
  req.body.userId = decodedToken.userId;
  next();
};

export default auth;
