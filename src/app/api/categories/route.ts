import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const filter = activeOnly ? { isActive: true } : {};

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, image, slug } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if category with same slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this slug already exists" },
        { status: 400 },
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 },
    );
  }
}
