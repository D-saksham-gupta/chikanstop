import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";
import { CheckCircle, Package, MapPin, CreditCard, Home } from "lucide-react";
import { serializeOrder } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  await dbConnect();

  const order = await Order.findById(id)
    .populate("items.product", "name slug")
    .lean();

  if (!order) {
    notFound();
  }

  // Verify order belongs to user
  if (order.user.toString() !== session.user.id) {
    notFound();
  }

  // const plainOrder = {
  //   ...order,
  //   _id: order._id.toString(),
  //   user: order.user.toString(),
  //   items: order.items.map((item: any) => ({
  //     ...item,
  //     _id: item._id?.toString(),
  //     product: item.product?._id
  //       ? item.product._id.toString()
  //       : item.product.toString(),
  //   })),
  //   createdAt: order.createdAt
  //     ? new Date(order.createdAt).toISOString()
  //     : new Date().toISOString(),
  // };

  const plainOrder = serializeOrder(order);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Details */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-xl font-bold text-gray-900">
                {plainOrder.orderNumber}
              </p>
            </div>
            <Badge variant="success">{plainOrder.orderStatus}</Badge>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {plainOrder.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
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
          </div>

          {/* Shipping Address */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">
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
          </div>

          {/* Payment Method */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">
                Payment Method
              </h2>
            </div>
            <p className="text-gray-700">{plainOrder.paymentMethod}</p>
            <Badge
              variant={
                plainOrder.paymentStatus === "Paid" ? "success" : "warning"
              }
            >
              {plainOrder.paymentStatus}
            </Badge>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
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
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/orders" className="flex-1">
            <Button variant="outline" fullWidth>
              View All Orders
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button fullWidth>
              <Home className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
