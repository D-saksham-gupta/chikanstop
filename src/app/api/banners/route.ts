import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";

// GET /api/banners - Get all banners
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("active") === "true";

    const filter = activeOnly ? { isActive: true } : {};

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 },
    );
  }
}

// POST /api/banners - Create new banner (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    const banner = await Banner.create(body);

    return NextResponse.json(
      {
        success: true,
        data: banner,
        message: "Banner created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 },
    );
  }
}
