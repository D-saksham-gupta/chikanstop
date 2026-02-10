import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Banner from "@/models/Banner";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/banners/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await dbConnect();

    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error("Get banner error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}

// PUT /api/banners/[id] - Update banner (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    const banner = await Banner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: banner,
      message: "Banner updated successfully",
    });
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 },
    );
  }
}

// DELETE /api/banners/[id] - Delete banner (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 },
    );
  }
}
