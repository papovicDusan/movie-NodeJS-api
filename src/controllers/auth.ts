import authService from "../services/auth";
import { NextFunction, Request, Response } from "express";
import { BaseUser, IUser, IUserMovieWatchlist } from "../models/user";
import { StatusCodes } from "http-status-codes";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const userData: BaseUser = req.body;

  const user: IUser = await authService.signup(userData);

  res
    .status(StatusCodes.CREATED)
    .json({ message: "User created!", userId: user._id });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const { access, userId }: { access: string; userId: string } =
    await authService.login(email, password);

  res.status(StatusCodes.OK).json({ access: access, userId: userId });
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId: string = req.body.userId;

  const user: IUserMovieWatchlist = await authService.getUser(userId);

  res.status(StatusCodes.OK).json(user);
};

export default { signup, login, getUser };
