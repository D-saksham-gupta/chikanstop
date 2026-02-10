"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store";
import { Button, Card, Input, Modal } from "@/components/ui";
import {
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  Plus,
  Check,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

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
  isDefault: boolean;
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
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState<Address>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
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
      if (data.success) {
        setSavedAddresses(data.data);
        // Auto-select default address
        const defaultAddr = data.data.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Address added successfully");
        setSavedAddresses(data.data);
        // Select the newly added address
        const newAddr = data.data[data.data.length - 1];
        setSelectedAddressId(newAddr._id);
        setIsAddingNewAddress(false);
        // Reset form
        setNewAddress({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
          isDefault: false,
        });
      } else {
        toast.error(data.error || "Failed to add address");
      }
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === selectedAddressId,
    );
    if (!selectedAddress) {
      toast.error("Invalid address selected");
      return;
    }

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
          shippingAddress: {
            fullName: selectedAddress.fullName,
            phone: selectedAddress.phone,
            addressLine1: selectedAddress.addressLine1,
            addressLine2: selectedAddress.addressLine2 || "",
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            country: selectedAddress.country,
          },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-500" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNewAddress(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </Button>
              </div>

              {savedAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No saved addresses</p>
                  <Button onClick={() => setIsAddingNewAddress(true)}>
                    <Plus className="w-4 h-4" />
                    Add Your First Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddressId(address._id!)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === address._id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-gray-900">
                              {address.fullName}
                            </p>
                            {address.isDefault && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">
                            {address.phone}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {address.addressLine1}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.pincode}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.country}
                          </p>
                        </div>
                        {selectedAddressId === address._id && (
                          <div className="bg-primary-500 text-white p-1 rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
              <Button
                onClick={handlePlaceOrder}
                fullWidth
                size="lg"
                isLoading={isLoading}
                disabled={!selectedAddressId}
              >
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
      </div>

      {/* Add New Address Modal */}
      <Modal
        isOpen={isAddingNewAddress}
        onClose={() => setIsAddingNewAddress(false)}
        title="Add New Address"
      >
        <form onSubmit={handleAddNewAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={newAddress.fullName}
              onChange={(e) =>
                setNewAddress({ ...newAddress, fullName: e.target.value })
              }
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Address Line 1"
            value={newAddress.addressLine1}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine1: e.target.value })
            }
            required
          />

          <Input
            label="Address Line 2 (Optional)"
            value={newAddress.addressLine2}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine2: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
              required
            />
            <Input
              label="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
              required
            />
            <Input
              label="Country"
              value={newAddress.country}
              onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              }
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newAddress.isDefault}
              onChange={(e) =>
                setNewAddress({ ...newAddress, isDefault: e.target.checked })
              }
              className="w-4 h-4 text-primary-500"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>

          <div className="flex gap-3">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Save & Use Address
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setIsAddingNewAddress(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
