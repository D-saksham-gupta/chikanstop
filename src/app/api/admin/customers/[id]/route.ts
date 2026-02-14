import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/customers/[id] - Get single customer
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const customer = await User.findById(id).select("-password").lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const orderStats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        _id: customer._id.toString(),
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
        orders: orders.map((o) => ({
          ...o,
          _id: o._id.toString(),
          createdAt: o.createdAt.toISOString(),
        })),
        totalSpent: orderStats[0]?.totalSpent || 0,
        orderCount: orderStats[0]?.orderCount || 0,
      },
    });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/customers/[id] - Update customer (block/unblock)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    // Prevent blocking yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot modify your own account" },
        { status: 400 },
      );
    }

    const customer = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: body.isBlocked,
        blockedReason: body.blockedReason || "",
      },
      { new: true },
    ).select("-password");

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
      message: body.isBlocked
        ? "Customer blocked successfully"
        : "Customer unblocked successfully",
    });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    if (id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 },
    );
  }
}
