import mongoose, { Schema, models } from "mongoose";

const SaleBarSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    link: String,
    backgroundColor: {
      type: String,
      default: "#000000",
    },
    textColor: {
      type: String,
      default: "#ffffff",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const SaleBar = models.SaleBar || mongoose.model("SaleBar", SaleBarSchema);

export default SaleBar;
