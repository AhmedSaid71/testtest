import { body, check, param } from "express-validator";
import { validatorMiddleware } from "../../middlewares";

export const createRestaurantValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("country").notEmpty().withMessage("Country is required"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be a positive number"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimate delivery time must be a positive number "),
  body("cuisines")
    .isArray()
    .withMessage("cuisines must be an array")
    .notEmpty()
    .withMessage(""),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("Menu items name is required"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu items price must be a positive number"),
  validatorMiddleware,
];

export const getUserRestaurantsValidator = [
  check("id")
    .isMongoId()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid id!!"),
  validatorMiddleware,
];
export const getRestaurantValidator = [
  param("id")
    .isMongoId()
    .withMessage("Please provide a valid id!!")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Please provide a valid id!!"),
  validatorMiddleware,
];

export const getAllUserRestaurantsValidator = [
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City is required!")
    .not()
    .isMongoId()
    .withMessage("Please provide a valid city"),
  validatorMiddleware,
];
