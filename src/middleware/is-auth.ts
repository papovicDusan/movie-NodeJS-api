import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/app-error";

interface JwtPayload {
  userId: string;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: UnauthorizedError = new UnauthorizedError(
      "Not authenticated."
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
    const error: UnauthorizedError = new UnauthorizedError(
      "Not authenticated."
    );
    throw error;
  }
  req.body.userId = decodedToken.userId;
  next();
};

export default auth;
