import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/utils";

// POST /api/orders - Create new order
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
    } = body;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in order" },
        { status: 400 },
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Shipping address is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Verify product availability and prices
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} not found` },
          { status: 400 },
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient stock for ${product.name}`,
          },
          { status: 400 },
        );
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: session.user.id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Pending",
      subtotal,
      shippingCost,
      tax,
      total,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name slug");

    return NextResponse.json(
      {
        success: true,
        data: populatedOrder,
        message: "Order placed successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 },
    );
  }
}

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const orders = await Order.find({ user: session.user.id })
      .populate("items.product", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
