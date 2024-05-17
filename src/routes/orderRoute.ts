import express from "express";
import { protect } from "../middlewares";
import {
  createCheckoutSession,
  getOrders,
  stripeWebhookHandler,
} from "../controllers";

const router = express.Router();

router.get("/", protect, getOrders);
router.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession
);
router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
