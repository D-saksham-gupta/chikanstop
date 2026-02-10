import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/products/[slug] - Get single product
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await dbConnect();

    const product = await Product.findOne({ slug }).populate(
      "category",
      "name slug",
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[slug] - Update product (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await req.json();

    await dbConnect();

    // If slug is being changed, check if new slug already exists
    if (body.slug && body.slug !== slug) {
      const existingProduct = await Product.findOne({ slug: body.slug });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "A product with this slug already exists" },
          { status: 400 },
        );
      }
    }

    const product = await Product.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[slug] - Delete product (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await dbConnect();

    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
