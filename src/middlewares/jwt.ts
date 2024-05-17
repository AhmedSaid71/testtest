import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "You are not logged in! Please log in to get access.",
    });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "failed",
        message: "The user belonging to this token does no longer exist.",
      });
    }
    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "error",
      message: "Invalid token! Please log in again to get access.",
    });
  }
};
