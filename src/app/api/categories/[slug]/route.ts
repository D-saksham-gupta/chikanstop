import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/categories/[slug] - Get single category
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await dbConnect();

    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

// PUT /api/categories/[slug] - Update category (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await req.json();

    await dbConnect();

    // If slug is being changed, check if new slug already exists
    if (body.slug && body.slug !== slug) {
      const existingCategory = await Category.findOne({ slug: body.slug });
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: "A category with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const category = await Category.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 },
    );
  }
}

// DELETE /api/categories/[slug] - Delete category (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await dbConnect();

    const category = await Category.findOneAndDelete({ slug });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
