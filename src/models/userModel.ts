import mongoose from "mongoose";
import { IUser } from "../types";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String || undefined,
      required: [true, "PasswordConfirm is required"],
      validate: {
        //this works only in create and save not update !!!
        validator: function (this: IUser, value: string) {
          return value === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    addressLine1: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined as any;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model<IUser>("User", userSchema);

export default User;
