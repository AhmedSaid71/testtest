import Stripe from "stripe";
import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";
import Order from "../models/orderModel";
import { ApiError, catchAsync, createLineItems, createSession } from "../utils";
import { ICheckoutSessionRequest } from "../types";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export const stripeWebhookHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let event;

    try {
      const signature = req.headers["stripe-signature"];
      event = STRIPE.webhooks.constructEvent(
        req.body,
        signature as string,
        STRIPE_ENDPOINT_SECRET
      );
    } catch (error: any) {
      console.log(error);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const order = await Order.findById(event.data.object.metadata?.orderId);

      if (!order) {
        return next(new ApiError("Order not found", 404));
      }

      order.totalAmount = event.data.object.amount_total;
      order.status = "paid";

      await order.save();
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
    });
  }
);

export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const checkoutSessionRequest: ICheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      return next(new ApiError("Restaurant not found", 404));
    }

    const newOrder = await Order.create({
      restaurant: restaurant,
      user: req.user?._id,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );
    console.log(session);
    if (!session.url) {
      return next(new ApiError("Error creating stripe checkout session", 500));
    }

    res.status(201).json({
      status: "success",
      message: "Session created successfully",
      url: session.url,
    });
  }
);

export const getOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const orders = await Order.find({ user: userId })
      .populate("restaurant")
      .populate("user");
    if (!orders) {
      return next(new ApiError("There are no orders!!", 404));
    }
    res.status(200).json({
      status: "success",
      data: { orders },
    });
  }
);
