import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface JwtPayload {
  userId: any;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: any = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret") as JwtPayload;
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error: any = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.body.userId = decodedToken.userId;
  next();
};

export default auth;
