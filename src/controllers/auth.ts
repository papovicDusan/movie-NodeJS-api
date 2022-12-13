import authService from "../services/auth";
import { NextFunction, Request, Response } from "express";
import log from "../logger";
import { BaseUser, IUser, IUserMovieWatchlist } from "../models/user";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData: BaseUser = req.body;

    const user: IUser = await authService.signup(userData);

    res.status(201).json({ message: "User created!", userId: user._id });
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const { access, userId }: { access: string; userId: string } =
      await authService.login(email, password);

    res.status(200).json({ access: access, userId: userId });
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.body.userId;

    const user: IUserMovieWatchlist = await authService.getUser(userId);

    res.status(200).json(user);
  } catch (err: any) {
    log.error(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export default { signup, login, getUser };
