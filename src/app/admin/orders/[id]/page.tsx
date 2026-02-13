import { requireAdmin } from "@/lib/adminAuth";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react";
import { serializeOrder } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  await dbConnect();

  const order = await Order.findById(id)
    .populate("user", "name email phone")
    .populate("items.product", "name slug")
    .lean();

  if (!order) {
    notFound();
  }

  const plainOrder = serializeOrder(order);

  // If serialization fails, show 404
  if (!plainOrder) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{plainOrder.orderNumber}
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(plainOrder.createdAt).toLocaleString()}
          </p>
        </div>
        <Badge
          variant={
            plainOrder.orderStatus === "Delivered"
              ? "success"
              : plainOrder.orderStatus === "Cancelled"
                ? "danger"
                : "default"
          }
        >
          {plainOrder.orderStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {plainOrder.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                >
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
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} • Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      ₹{item.price} × {item.quantity} = ₹
                      {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Customer Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Customer Information
              </h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {plainOrder.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {plainOrder.user.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {plainOrder.user.phone || "N/A"}
              </p>
            </div>
          </Card>

          {/* Shipping Address */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Shipping Address
              </h2>
            </div>
            <div className="text-gray-700">
              <p className="font-medium">
                {plainOrder.shippingAddress.fullName}
              </p>
              <p>{plainOrder.shippingAddress.phone}</p>
              <p>{plainOrder.shippingAddress.addressLine1}</p>
              {plainOrder.shippingAddress.addressLine2 && (
                <p>{plainOrder.shippingAddress.addressLine2}</p>
              )}
              <p>
                {plainOrder.shippingAddress.city},{" "}
                {plainOrder.shippingAddress.state}{" "}
                {plainOrder.shippingAddress.pincode}
              </p>
              <p>{plainOrder.shippingAddress.country}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Update Status
            </h2>
            <OrderStatusUpdater
              orderId={plainOrder._id}
              currentStatus={plainOrder.orderStatus}
            />
          </Card>

          {/* Payment Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="font-medium">{plainOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <Badge
                  variant={
                    plainOrder.paymentStatus === "Paid" ? "success" : "warning"
                  }
                >
                  {plainOrder.paymentStatus}
                </Badge>
              </div>
              {plainOrder.paymentId && (
                <div className="flex flex-col gap-1 pt-2">
                  <span className="text-gray-600 text-sm">Payment ID:</span>
                  <span className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                    {plainOrder.paymentId}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{plainOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>₹{plainOrder.shippingCost}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (GST)</span>
                <span>₹{plainOrder.tax}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₹{plainOrder.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
