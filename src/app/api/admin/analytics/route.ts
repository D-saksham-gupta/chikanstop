import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30"; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get orders for the period
    const orders = await Order.find({
      createdAt: { $gte: daysAgo },
    }).lean();

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Order status breakdown
    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    // Revenue by day
    const revenueByDay = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    const dailyRevenue = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Orders by day
    const ordersByDay = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const dailyOrders = Object.entries(ordersByDay)
      .map(([date, count]) => ({
        date,
        orders: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top selling products
    const productSales: any = {};
    orders.forEach((order) => {
      order.items.forEach((item: any) => {
        const productId = item.product.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            productId,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Recent customers
    const recentCustomers = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email createdAt")
      .lean();

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    // Customer statistics
    const totalCustomers = await User.countDocuments({ role: "user" });
    const newCustomers = await User.countDocuments({
      role: "user",
      createdAt: { $gte: daysAgo },
    });

    // Payment method breakdown
    const paymentMethods = orders.reduce((acc: any, order) => {
      acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalOrders,
          averageOrderValue,
          totalProducts,
          activeProducts,
          outOfStock,
          totalCustomers,
          newCustomers,
        },
        ordersByStatus,
        dailyRevenue,
        dailyOrders,
        topProducts,
        recentCustomers: recentCustomers.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          email: c.email,
          createdAt: c.createdAt.toISOString(),
        })),
        paymentMethods,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
