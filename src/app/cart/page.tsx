"use client";

import { useCartStore } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18); // 18% GST
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-gray-200 last:border-0"
                  >
                    {/* Product Image */}
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
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

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-600 mb-3">
                        <span>Size: {item.size}</span>
                        {item.color && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Color: {item.color}</span>
                          </>
                        )}
                      </div>

                      {/* Price */}
                      <p className="font-bold text-gray-900 mb-3">
                        ₹{item.price * item.quantity}
                        <span className="text-sm text-gray-500 font-normal ml-2">
                          (₹{item.price} each)
                        </span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= item.stock && (
                        <p className="text-sm text-red-600 mt-2">
                          Maximum available quantity reached
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add ₹{999 - totalPrice} more to get FREE shipping!
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-700">
                  <span>Tax (18% GST)</span>
                  <span className="font-medium">₹{tax}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              {session ? (
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => router.push("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() =>
                      router.push("/auth/signin?callbackUrl=/checkout")
                    }
                  >
                    Sign In to Checkout
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    or{" "}
                    <Link
                      href="/auth/signup?callbackUrl=/checkout"
                      className="text-primary-500 hover:underline font-medium"
                    >
                      create an account
                    </Link>
                  </p>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Easy returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Free shipping on orders over ₹999</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
