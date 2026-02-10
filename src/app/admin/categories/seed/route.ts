import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export async function POST() {
  try {
    await dbConnect();

    const defaultCategories = [
      {
        name: "Men",
        slug: "men",
        description: "Men's clothing and accessories",
        isActive: true,
      },
      {
        name: "Women",
        slug: "women",
        description: "Women's clothing and accessories",
        isActive: true,
      },
      {
        name: "Kids",
        slug: "kids",
        description: "Kids' clothing and accessories",
        isActive: true,
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Fashion accessories",
        isActive: true,
      },
      {
        name: "New Arrivals",
        slug: "new-arrivals",
        description: "Latest products",
        isActive: true,
      },
      {
        name: "Sale",
        slug: "sale",
        description: "Products on sale",
        isActive: true,
      },
    ];

    // Clear existing categories (optional)
    // await Category.deleteMany({});

    // Insert default categories
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Default categories created successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Seed categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed categories" },
      { status: 500 },
    );
  }
}
