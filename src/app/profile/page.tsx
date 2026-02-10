"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Modal } from "@/components/ui";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Package,
  Heart,
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [addressForm, setAddressForm] = useState<Address>({
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchAddresses();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setProfileData({
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      const data = await response.json();

      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated successfully");
        setIsEditingProfile(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Address added successfully");
        setAddresses(data.data);
        setIsAddingAddress(false);
        resetAddressForm();
      } else {
        toast.error(data.error || "Failed to add address");
      }
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress?._id) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: editingAddress._id,
          ...addressForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Address updated successfully");
        setAddresses(data.data);
        setEditingAddress(null);
        resetAddressForm();
      } else {
        toast.error(data.error || "Failed to update address");
      }
    } catch (error) {
      toast.error("Failed to update address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await fetch(`/api/user/addresses?id=${addressId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Address deleted successfully");
        setAddresses(data.data);
      } else {
        toast.error(data.error || "Failed to delete address");
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
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
  };

  const openEditAddress = (address: Address) => {
    setAddressForm(address);
    setEditingAddress(address);
  };

  if (status === "loading") {
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
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-primary-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.name}
                </h2>
                <p className="text-gray-600 text-sm">{profileData.email}</p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">My Orders</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Wishlist</span>
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                  <div className="flex gap-3">
                    <Button type="submit" isLoading={isLoading}>
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">
                        {profileData.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {profileData.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">
                        {profileData.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Saved Addresses */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Saved Addresses
                </h2>
                <Button onClick={() => setIsAddingAddress(true)}>
                  <Plus className="w-4 h-4" />
                  Add Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No addresses saved yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {address.fullName}
                          </p>
                          {address.isDefault && (
                            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mt-1">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditAddress(address)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id!)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>{address.phone}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddingAddress}
        onClose={() => {
          setIsAddingAddress(false);
          resetAddressForm();
        }}
        title="Add New Address"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={addressForm.fullName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, fullName: e.target.value })
              }
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Address Line 1"
            value={addressForm.addressLine1}
            onChange={(e) =>
              setAddressForm({ ...addressForm, addressLine1: e.target.value })
            }
            required
          />

          <Input
            label="Address Line 2 (Optional)"
            value={addressForm.addressLine2}
            onChange={(e) =>
              setAddressForm({ ...addressForm, addressLine2: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              required
            />
            <Input
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, pincode: e.target.value })
              }
              required
            />
            <Input
              label="Country"
              value={addressForm.country}
              onChange={(e) =>
                setAddressForm({ ...addressForm, country: e.target.value })
              }
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 text-primary-500"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>

          <div className="flex gap-3">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Save Address
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setIsAddingAddress(false);
                resetAddressForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={!!editingAddress}
        onClose={() => {
          setEditingAddress(null);
          resetAddressForm();
        }}
        title="Edit Address"
      >
        <form onSubmit={handleUpdateAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={addressForm.fullName}
              onChange={(e) =>
                setAddressForm({ ...addressForm, fullName: e.target.value })
              }
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Address Line 1"
            value={addressForm.addressLine1}
            onChange={(e) =>
              setAddressForm({ ...addressForm, addressLine1: e.target.value })
            }
            required
          />

          <Input
            label="Address Line 2 (Optional)"
            value={addressForm.addressLine2}
            onChange={(e) =>
              setAddressForm({ ...addressForm, addressLine2: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={addressForm.city}
              onChange={(e) =>
                setAddressForm({ ...addressForm, city: e.target.value })
              }
              required
            />
            <Input
              label="State"
              value={addressForm.state}
              onChange={(e) =>
                setAddressForm({ ...addressForm, state: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Pincode"
              value={addressForm.pincode}
              onChange={(e) =>
                setAddressForm({ ...addressForm, pincode: e.target.value })
              }
              required
            />
            <Input
              label="Country"
              value={addressForm.country}
              onChange={(e) =>
                setAddressForm({ ...addressForm, country: e.target.value })
              }
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) =>
                setAddressForm({ ...addressForm, isDefault: e.target.checked })
              }
              className="w-4 h-4 text-primary-500"
            />
            <span className="text-sm text-gray-700">
              Set as default address
            </span>
          </label>

          <div className="flex gap-3">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Update Address
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setEditingAddress(null);
                resetAddressForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
