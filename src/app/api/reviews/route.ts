import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";

// GET /api/reviews - Get reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const reviews = await Review.find({ product: productId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create new review
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Product ID and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }

    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      user: session.user.id,
      "items.product": productId,
      orderStatus: "Delivered",
    });

    // Create review
    const review = await Review.create({
      product: productId,
      user: session.user.id,
      rating,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      "ratings.average": averageRating,
      "ratings.count": reviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "user",
      "name image",
    );

    return NextResponse.json(
      {
        success: true,
        data: populatedReview,
        message: "Review submitted successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
