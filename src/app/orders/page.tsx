import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { serializeOrder } from "@/lib/serialize";

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders");
  }

  await dbConnect();

  const orders = await Order.find({ user: session.user.id })
    .populate("items.product", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  // const plainOrders = orders.map((order) => ({
  //   ...order,
  //   _id: order._id.toString(),
  //   user: order.user.toString(),
  //   items: order.items.map((item: any) => ({
  //     ...item,
  //     _id: item._id?.toString(),
  //     product: item.product?._id
  //       ? item.product._id.toString()
  //       : item.product?.toString(),
  //   })),
  //   createdAt: order.createdAt
  //     ? new Date(order.createdAt).toISOString()
  //     : new Date().toISOString(),
  // }));

  //  const plainOrders = orders.map(serializeOrder);
  const plainOrders = orders.map(serializeOrder).filter(Boolean);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View and track your orders</p>
        </div>

        {/* Orders List */}
        {plainOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {plainOrders.map((order: any) => (
              <Card
                key={order._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.orderNumber}
                      </h3>
                      <Badge variant={getStatusColor(order.orderStatus) as any}>
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right mt-4 sm:mt-0">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.slice(0, 2).map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} • Size: {item.size}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-600">
                      +{order.items.length - 2} more item(s)
                    </p>
                  )}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/orders/${order._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-primary-500 text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  {/* {order.orderStatus === "Delivered" && (
                    <Link
                      
                      href={`/orders/${order._id}/review`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
                    >
                      Write Review
                    </Link>
                  )} */}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
