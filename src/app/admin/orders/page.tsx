import { requireAdmin } from "@/lib/adminAuth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";
import { Eye, Package } from "lucide-react";
import { filterNull, serializeOrder } from "@/lib/serialize";

export default async function AdminOrdersPage() {
  await requireAdmin();
  await dbConnect();

  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("items.product", "name")
    .sort({ createdAt: -1 })
    .lean();

  // const plainOrders = orders.map((order) => ({
  //   ...order,
  //   _id: order._id.toString(),
  //   user: {
  //     _id: order.user._id.toString(),
  //     name: order.user.name,
  //     email: order.user.email,
  //   },
  //   items: order.items.map((item: any) => ({
  //     ...item,
  //     _id: item._id?.toString(),
  //     product: item.product?._id?.toString() || "",
  //     name: item.name,
  //   })),
  //   createdAt: order.createdAt
  //     ? new Date(order.createdAt).toISOString()
  //     : new Date().toISOString(),
  // }));

  // const plainOrders = orders.map(serializeOrder);
  // const plainOrders = orders.map(serializeOrder).filter(Boolean);
  const plainOrders = filterNull(orders.map(serializeOrder));

  // Calculate stats
  const totalOrders = plainOrders.length;
  const totalRevenue = plainOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = plainOrders.filter(
    (o) => o.orderStatus === "Pending",
  ).length;
  const deliveredOrders = plainOrders.filter(
    (o) => o.orderStatus === "Delivered",
  ).length;

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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        {plainOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plainOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">
                        {order.items.length} items
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        ₹{order.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            order.paymentStatus === "Paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(order.orderStatus) as any}>
                        {order.orderStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders/${order._id}`}>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
