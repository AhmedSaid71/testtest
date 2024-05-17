import { NextFunction, Request, Response } from "express";
import { catchAsync, createSendToken, ApiError } from "../utils";
import User from "../models/userModel";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return next(new ApiError("Email already signed up!", 409));
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ApiError("Email and password are required!", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ApiError("User not found!. Please signup first!.", 404));
    }

    if (!(await user.correctPassword(password, user.password))) {
      return next(new ApiError("Invalid credentials", 401));
    }

    createSendToken(user, 200, res);
  }
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "loggedOut", {
      expires: new Date(Date.now() * 1000),
      httpOnly: true,
    });
    res
      .status(200)
      .json({ status: "success", message: "You are now logged out!" });
  }
);
