import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SaleBar from "@/models/SaleBar";

// GET /api/salebar - Get active sale bar
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const saleBar = await SaleBar.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: saleBar,
    });
  } catch (error) {
    console.error("Get sale bar error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale bar" },
      { status: 500 },
    );
  }
}

// POST /api/salebar - Create/Update sale bar (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Deactivate all existing sale bars
    await SaleBar.updateMany({}, { isActive: false });

    // Create new sale bar
    const saleBar = await SaleBar.create(body);

    return NextResponse.json(
      {
        success: true,
        data: saleBar,
        message: "Sale bar updated successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create sale bar error:", error);
    return NextResponse.json(
      { error: "Failed to create sale bar" },
      { status: 500 },
    );
  }
}

// DELETE /api/salebar - Deactivate sale bar (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    await SaleBar.updateMany({}, { isActive: false });

    return NextResponse.json({
      success: true,
      message: "Sale bar deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate sale bar error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate sale bar" },
      { status: 500 },
    );
  }
}
