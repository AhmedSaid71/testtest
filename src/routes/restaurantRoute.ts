import express from "express";

import {
  createRestaurant,
  getRestaurant,
  getRestaurantOrders,
  getRestaurants,
  getUserRestaurant,
  updateOrderStatus,
  updateUserRestaurant,
} from "../controllers";

import { protect, upload } from "../middlewares";
import {
  createRestaurantValidator,
  getAllUserRestaurantsValidator,
  getRestaurantValidator,
  getUserRestaurantsValidator,
} from "../utils";

const router = express.Router();

router.get("/order", protect, getRestaurantOrders);
router.get("/me", upload.single("imageFile"), protect, getUserRestaurant);
router.get("/:city", getAllUserRestaurantsValidator, getRestaurants);
router.get("/details/:id", getRestaurantValidator, getRestaurant);
router.post(
  "/",
  upload.single("imageFile"),
  createRestaurantValidator,
  protect,
  createRestaurant
);
router.patch("/order/:orderId/status", protect, updateOrderStatus);
router.patch("/", upload.single("imageFile"), protect, updateUserRestaurant);

export default router;
