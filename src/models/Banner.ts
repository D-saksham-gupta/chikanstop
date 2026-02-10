import mongoose, { Schema, models } from "mongoose";

const BannerSchema = new Schema(
  {
    title: String,
    subtitle: String,
    image: {
      url: String,
      publicId: String,
    },
    link: String,
    buttonText: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Banner = models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner;
