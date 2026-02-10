import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products - Get all products with filters
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const sizes = searchParams.get("sizes")?.split(",");
    const colors = searchParams.get("colors")?.split(",");
    const featured = searchParams.get("featured") === "true";
    const active = searchParams.get("active") === "true";

    // Sorting
    const sort = searchParams.get("sort") || "newest";

    // Build query
    const query: any = {};

    if (active) {
      query.isActive = true;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (minRating) {
      query["ratings.average"] = { $gte: parseFloat(minRating) };
    }

    if (sizes && sizes.length > 0) {
      query["sizes.size"] = { $in: sizes };
    }

    if (colors && colors.length > 0) {
      query["colors.name"] = { $in: colors };
    }

    if (featured) {
      query.isFeatured = true;
    }

    // Sort options
    let sortOption: any = {};
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { "ratings.average": -1 };
        break;
      case "popular":
        sortOption = { "ratings.count": -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Execute query
    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

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
