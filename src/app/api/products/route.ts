import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

// GET /api/products - Get all products with filters
// GET /api/products - Get all products with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Build query
    const query: any = { isActive: true };

    // Category filter
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      }
    }

    // Search filter
    const search = searchParams.get("search");
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    const minRating = searchParams.get("minRating");
    if (minRating) {
      query["ratings.average"] = { $gte: parseFloat(minRating) };
    }

    // Sizes filter
    const sizes = searchParams.get("sizes");
    if (sizes) {
      const sizeArray = sizes.split(",");
      query["sizes.size"] = { $in: sizeArray };
    }

    // Colors filter
    const colors = searchParams.get("colors");
    if (colors) {
      const colorArray = colors.split(",");
      query["colors.name"] = { $in: colorArray };
    }

    // Featured filter
    const featured = searchParams.get("featured");
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Sort
    let sort: any = { createdAt: -1 };
    const sortBy = searchParams.get("sort");
    switch (sortBy) {
      case "price-low":
        sort = { price: 1 };
        break;
      case "price-high":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { "ratings.average": -1 };
        break;
      case "popular":
        sort = { "ratings.count": -1 };
        break;
    }

    await dbConnect();

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      price,
      comparePrice,
      category,
      images,
      sizes,
      colors,
      stock,
      slug,
      tags,
      isFeatured,
    } = body;

    // Validation
    if (!name || !description || !price || !category || !slug) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if product with same slug exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product with this slug already exists" },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      comparePrice,
      category,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      tags: tags || [],
      isFeatured: isFeatured || false,
      isActive: true,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug",
    );

    return NextResponse.json(
      {
        success: true,
        data: populatedProduct,
        message: "Product created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 },
    );
  }
}
