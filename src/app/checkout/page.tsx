"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store";
import { Button, Card, Input, Modal } from "@/components/ui";
import { ArrowLeft, Package, CreditCard, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import RazorpayTestGuide from "@/components/store/RazorpayTestGuide";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Address>({
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

  // Fetch saved addresses
  useEffect(() => {
    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setSavedAddresses(data.data);

        // Auto-select default address or first address
        const defaultAddress = data.data.find(
          (addr: Address) => addr.isDefault,
        );
        const addressToSelect = defaultAddress || data.data[0];

        if (addressToSelect) {
          setSelectedAddressId(addressToSelect._id!);
          setShippingAddress(addressToSelect);
        }
      } else {
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setShowNewAddressForm(true);
    }
  };

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

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address._id!);
    setShippingAddress(address);
    setShowNewAddressForm(false);
  };

  const createOrder = async (razorpayPaymentId?: string) => {
    try {
      const orderItems = items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      console.log("Creating order with items:", orderItems);
      console.log("Payment ID:", razorpayPaymentId);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          paymentMethod,
          paymentId: razorpayPaymentId,
          subtotal,
          shippingCost,
          tax,
          total,
        }),
      });

      const data = await response.json();
      console.log("Order creation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      return data.data;
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error("Failed to create payment order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ChikanStop",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          console.log("Razorpay payment response:", response);
          setIsLoading(true);

          try {
            // Verify payment
            console.log("Verifying payment...");
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            console.log("Verification response:", verifyData);

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed",
              );
            }

            if (verifyData.success) {
              // Create order in database
              console.log("Creating order in database...");
              const order = await createOrder(response.razorpay_payment_id);
              console.log("Order created:", order);

              // Clear cart
              clearCart();

              toast.success("Payment successful! Order placed.");
              router.push(`/orders/${order._id}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            console.error("Payment handler error:", error);
            toast.error(error.message || "Payment verification failed");
            setIsLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: session?.user?.email || "",
          contact: shippingAddress.phone,
        },
        notes: {
          address: `${shippingAddress.addressLine1}, ${shippingAddress.city}`,
        },
        theme: {
          color: "#f43f5e",
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: "All payment methods",
                instruments: [
                  {
                    method: "card",
                  },
                  {
                    method: "upi",
                  },
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setIsLoading(false);
        toast.error(response.error.description || "Payment failed");
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Razorpay payment error:", error);
      toast.error(error.message || "Payment failed");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address is selected or filled
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1
    ) {
      toast.error("Please select or fill in a shipping address");
      return;
    }

    setIsLoading(true);

    try {
      if (paymentMethod === "Razorpay") {
        await handleRazorpayPayment();
      } else {
        // COD payment
        const order = await createOrder();
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/orders/${order._id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
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
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Shipping Address
                    </h2>
                  </div>
                  {savedAddresses.length > 0 && !showNewAddressForm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNewAddressForm(true)}
                    >
                      <Plus className="w-4 h-4" />
                      New Address
                    </Button>
                  )}
                </div>

                {/* Saved Addresses */}
                {!showNewAddressForm && savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {savedAddresses.map((address) => (
                      <label
                        key={address._id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address._id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === address._id}
                          onChange={() => handleAddressSelect(address)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {address.fullName}
                              </p>
                              {address.isDefault && (
                                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                          {selectedAddressId === address._id && (
                            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                {(showNewAddressForm || savedAddresses.length === 0) && (
                  <>
                    {savedAddresses.length > 0 && (
                      <div className="mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowNewAddressForm(false);
                            if (savedAddresses.length > 0) {
                              handleAddressSelect(savedAddresses[0]);
                            }
                          }}
                        >
                          Use Saved Address
                        </Button>
                      </div>
                    )}

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
                          value={shippingAddress.addressLine2 || ""}
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
                  </>
                )}
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

                {/* Test Guide */}
                {process.env.NODE_ENV === "development" && (
                  <RazorpayTestGuide />
                )}

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

                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      disabled
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Pay Online (Razorpay){" "}
                        <span className="text-gray-500">(Coming Soon)</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Credit/Debit Card, UPI, Net Banking
                      </p>
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
                  {paymentMethod === "Razorpay" ? "Pay Now" : "Place Order"}
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
