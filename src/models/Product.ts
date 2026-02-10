import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    comparePrice: Number, // Original price for discount display
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    sizes: [
      {
        size: { type: String, required: true }, // S, M, L, XL, XXL
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    colors: [
      {
        name: String,
        hexCode: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  { timestamps: true },
);

const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;
