import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/reviews/[id] - Update review
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user owns this review
    if (review.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    review.rating = body.rating || review.rating;
    review.comment = body.comment || review.comment;
    await review.save();

    // Update product ratings
    const reviews = await Review.find({ product: review.product });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      "ratings.average": averageRating,
      "ratings.count": reviews.length,
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/[id] - Delete review
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user owns this review or is admin
    if (
      review.user.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product ratings
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      "ratings.average": averageRating,
      "ratings.count": reviews.length,
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
