import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
      .lean();

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    const plainCustomer = {
      ...customer,
      _id: customer._id.toString(),
      createdAt: customer.createdAt
        ? new Date(customer.createdAt).toISOString()
        : new Date().toISOString(),
      totalOrders: orders.length,
      totalSpent,
    };

    const plainOrders = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      user: order.user.toString(),
      items: order.items.map((item: any) => ({
        ...item,
        _id: item._id?.toString(),
        product: item.product?.toString(),
      })),
      createdAt: order.createdAt
        ? new Date(order.createdAt).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: { customer: plainCustomer, orders: plainOrders },
    });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 },
    );
  }
}
