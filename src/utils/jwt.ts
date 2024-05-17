import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { Response } from "express";

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    message:
      statusCode === 200
        ? "You are now Logged in!.\n Happy eating😁"
        : "You have created account successfully.\n You can login now",
    token,
    data: {
      user,
    },
  });
};
