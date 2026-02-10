import mongoose, { Schema, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Prevent multiple reviews from same user on same product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
