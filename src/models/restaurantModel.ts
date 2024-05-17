import mongoose, { InferSchemaType } from "mongoose";

const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});
export type TMenuItem = InferSchemaType<typeof menuItemSchema>;

const restaurantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    deliveryPrice: {
      type: Number,
      required: [true, "price is required"],
    },
    estimatedDeliveryTime: {
      type: Number,
      required: [true, "time is required"],
    },
    cuisines: [{ type: String, required: [true, "Cuisine name is required"] }],
    menuItems: [menuItemSchema],
    imageUrl: {
      type: String,
      required: [true, "Image url is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
