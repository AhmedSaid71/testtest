import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import restaurantRoute from "./routes/restaurantRoute";
import orderRoute from "./routes/orderRoute";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./utils/apiError";
import { globalError } from "./middlewares";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cookieParser());
app.use("/api/v1/orders/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
  })
);
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "health OK!" });
});
app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to MearnEats!!." });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/restaurants", restaurantRoute);
app.use("/api/v1/orders", orderRoute);
app.all("*", (req, res, next) => {
  // send the error to global error handler
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT || `8000`;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
//handle the errors that happens outside express
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION 💥 shutting down...");
  console.log(err.name, err.message);
  //close method handle if any pending requests to the server then it shutdown the server by calling process.exit
  server.close(() => {
    console.log("Shutting down!!!");
    process.exit(1);
  });
});
