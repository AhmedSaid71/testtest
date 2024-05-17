import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { catchAsync, filterObj } from "../utils";

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ status: "success", data: { user: req.user } });
  }
);

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filterBody = filterObj(
      req.body,
      "name",
      "addressLine1",
      "city",
      "country"
    );

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  }
);
