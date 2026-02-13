import { requireAdmin } from "@/lib/adminAuth";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Package, ShoppingBag } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  await requireAdmin();
  await dbConnect();

  // ✅ Next.js 16 requires awaiting params
  const { id } = await params;

  const customerDoc = await User.findById(id).select("-password").lean();

  if (!customerDoc) {
    notFound();
  }

  const ordersDoc = await Order.find({ user: id })
    .sort({ createdAt: -1 })
    .lean();

  const totalSpent = ordersDoc.reduce(
    (sum: number, order: any) => sum + order.total,
    0,
  );

  const customer = {
    ...customerDoc,
    _id: customerDoc._id.toString(),
    createdAt: customerDoc.createdAt
      ? new Date(customerDoc.createdAt).toISOString()
      : new Date().toISOString(),
    totalOrders: ordersDoc.length,
    totalSpent,
  };

  const orders = ordersDoc.map((order: any) => ({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "default";
      case "Processing":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                {customer.image ? (
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    {customer.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {customer.name}
              </h2>

              <p className="text-gray-500 text-sm">
                Customer since{" "}
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-700">{customer.email}</p>
              </div>

              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-700">{customer.phone}</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Statistics</h3>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Orders</span>
                <span className="font-bold">{customer.totalOrders}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-bold text-green-600">
                  ₹{customer.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Order History ({orders.length})
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders placed yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <div key={order._id} className="p-6">
                    <div className="flex justify-between">
                      <p className="font-bold">#{order.orderNumber}</p>
                      <Badge variant={getStatusColor(order.orderStatus) as any}>
                        {order.orderStatus}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">₹{order.total}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
