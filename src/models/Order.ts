import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "UPI", "Wallet"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    total: Number,
    trackingNumber: String,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true },
);

const Order = models.Order || mongoose.model("Order", OrderSchema);

export default Order;
