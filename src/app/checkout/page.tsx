"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store";
import { Button, Card, Input } from "@/components/ui";
import { ArrowLeft, Package, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare order items
      const orderItems = items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          paymentMethod,
          subtotal,
          shippingCost,
          tax,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      // Clear cart
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");

      // Redirect to order confirmation
      router.push(`/orders/${data.data._id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Address Line 1"
                      name="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Street address, P.O. box"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Address Line 2"
                      name="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <Input
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    required
                  />

                  <Input
                    label="State"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    required
                  />

                  <Input
                    label="Pincode"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    required
                  />

                  <Input
                    label="Country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      disabled
                      className="w-5 h-5 text-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Credit/Debit Card
                      </p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      disabled
                      className="w-5 h-5 text-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">UPI</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.size} • {item.color}
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST)</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-primary-500 hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
