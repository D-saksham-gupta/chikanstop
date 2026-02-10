import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Category = models.Category || mongoose.model("Category", CategorySchema);

export default Category;
