import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: { products: [], categories: [], total: 0 },
      });
    }

    await dbConnect();

    const searchFilter = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    };

    const [products, total, categories] = await Promise.all([
      Product.find(searchFilter)
        .populate("category", "name slug")
        .sort({ "ratings.average": -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(searchFilter),
      Category.find({
        isActive: true,
        name: { $regex: query, $options: "i" },
      })
        .limit(5)
        .lean(),
    ]);

    // Serialize
    const plainProducts = products.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      price: p.price,
      comparePrice: p.comparePrice,
      images: (p.images || []).map((img: any) => ({
        url: img.url || "",
        publicId: img.publicId || "",
      })),
      ratings: {
        average: p.ratings?.average || 0,
        count: p.ratings?.count || 0,
      },
      category: p.category
        ? {
            _id: (p.category as any)._id?.toString(),
            name: (p.category as any).name,
            slug: (p.category as any).slug,
          }
        : null,
      stock: p.stock,
    }));

    const plainCategories = categories.map((c) => ({
      _id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      image: c.image || "",
    }));

    return NextResponse.json({
      success: true,
      data: {
        products: plainProducts,
        categories: plainCategories,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
