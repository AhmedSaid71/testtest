import Stripe from "stripe";
import { TMenuItem } from "../models/restaurantModel";
import { IAnyObject, ICheckoutSessionRequest } from "../types";
import cloudinary from "cloudinary";

export const filterObj = (obj: IAnyObject, ...allowedFields: string[]) => {
  const newObj: IAnyObject = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

export const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};


