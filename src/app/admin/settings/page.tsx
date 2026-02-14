"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input } from "@/components/ui";
import {
  Store,
  Mail,
  Shield,
  Truck,
  CreditCard,
  Bell,
  Save,
  Globe,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("store");

  const [settings, setSettings] = useState({
    // Store Settings
    storeName: "Fashion Store",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    storeCurrency: "INR",
    storeLanguage: "en",

    // Order Settings
    freeShippingThreshold: "999",
    shippingCost: "99",
    taxRate: "18",
    allowGuestCheckout: false,
    autoConfirmOrders: false,
    maxOrderQuantity: "10",

    // Email Notifications
    sendOrderConfirmation: true,
    sendShippingUpdate: true,
    sendDeliveryConfirmation: true,
    sendReviewRequest: true,
    adminNotifyNewOrder: true,
    adminNotifyLowStock: true,
    lowStockThreshold: "5",

    // Maintenance
    maintenanceMode: false,
    maintenanceMessage:
      "We are currently under maintenance. We will be back soon!",

    // SEO
    metaTitle: "Fashion Store - Your Ultimate Shopping Destination",
    metaDescription:
      "Shop the latest trends in fashion with exclusive deals and fast delivery.",
    metaKeywords: "fashion, clothing, online shopping, trends",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();

      if (data.success && data.data) {
        setSettings((prev) => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "store", label: "Store", icon: Store },
    { id: "orders", label: "Orders", icon: Package },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "maintenance", label: "Maintenance", icon: Shield },
  ];

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store settings</p>
        </div>
        <Button onClick={handleSave} isLoading={isLoading}>
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>

      {/* Maintenance Mode Alert */}
      {settings.maintenanceMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <p className="text-yellow-800">
            <strong>Maintenance Mode is ON.</strong> Your store is not
            accessible to customers.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-56 shrink-0">
          <Card className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Store Settings */}
          {activeTab === "store" && (
            <>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Store className="w-5 h-5 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Store Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Store Name"
                    value={settings.storeName}
                    onChange={(e) => updateSetting("storeName", e.target.value)}
                    placeholder="My Fashion Store"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Store Email"
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) =>
                        updateSetting("storeEmail", e.target.value)
                      }
                      placeholder="store@example.com"
                    />

                    <Input
                      label="Store Phone"
                      type="tel"
                      value={settings.storePhone}
                      onChange={(e) =>
                        updateSetting("storePhone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Address
                    </label>
                    <textarea
                      value={settings.storeAddress}
                      onChange={(e) =>
                        updateSetting("storeAddress", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="123 Main Street, Mumbai, India"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={settings.storeCurrency}
                        onChange={(e) =>
                          updateSetting("storeCurrency", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={settings.storeLanguage}
                        onChange={(e) =>
                          updateSetting("storeLanguage", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Orders Settings */}
          {activeTab === "orders" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order & Shipping Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Free Shipping Threshold (₹)"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      updateSetting("freeShippingThreshold", e.target.value)
                    }
                  />
                  <Input
                    label="Shipping Cost (₹)"
                    type="number"
                    value={settings.shippingCost}
                    onChange={(e) =>
                      updateSetting("shippingCost", e.target.value)
                    }
                  />
                  <Input
                    label="Tax Rate (%)"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => updateSetting("taxRate", e.target.value)}
                  />
                </div>

                <Input
                  label="Max Order Quantity Per Item"
                  type="number"
                  value={settings.maxOrderQuantity}
                  onChange={(e) =>
                    updateSetting("maxOrderQuantity", e.target.value)
                  }
                />

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Allow Guest Checkout
                      </p>
                      <p className="text-sm text-gray-600">
                        Let customers checkout without an account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.allowGuestCheckout}
                      onChange={(e) =>
                        updateSetting("allowGuestCheckout", e.target.checked)
                      }
                      className="w-5 h-5 text-primary-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Auto-confirm Orders
                      </p>
                      <p className="text-sm text-gray-600">
                        Automatically move new orders to processing
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoConfirmOrders}
                      onChange={(e) =>
                        updateSetting("autoConfirmOrders", e.target.checked)
                      }
                      className="w-5 h-5 text-primary-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Email Notifications
                </h2>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-4">
                  Customer Notifications
                </p>

                {[
                  {
                    key: "sendOrderConfirmation",
                    label: "Order Confirmation",
                    desc: "Send email when order is placed",
                  },
                  {
                    key: "sendShippingUpdate",
                    label: "Shipping Update",
                    desc: "Send email when order is shipped",
                  },
                  {
                    key: "sendDeliveryConfirmation",
                    label: "Delivery Confirmation",
                    desc: "Send email when order is delivered",
                  },
                  {
                    key: "sendReviewRequest",
                    label: "Review Request",
                    desc: "Ask customers to review after delivery",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(settings as any)[item.key]}
                      onChange={(e) =>
                        updateSetting(item.key, e.target.checked)
                      }
                      className="w-5 h-5 text-primary-500 rounded"
                    />
                  </label>
                ))}

                <p className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-4 mt-6">
                  Admin Notifications
                </p>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New Order Alert</p>
                    <p className="text-sm text-gray-600">
                      Notify admin for every new order
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.adminNotifyNewOrder}
                    onChange={(e) =>
                      updateSetting("adminNotifyNewOrder", e.target.checked)
                    }
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Low Stock Alert</p>
                    <p className="text-sm text-gray-600">
                      Notify admin when product stock is low
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.adminNotifyLowStock}
                    onChange={(e) =>
                      updateSetting("adminNotifyLowStock", e.target.checked)
                    }
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                </label>

                {settings.adminNotifyLowStock && (
                  <Input
                    label="Low Stock Threshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) =>
                      updateSetting("lowStockThreshold", e.target.value)
                    }
                  />
                )}
              </div>
            </Card>
          )}

          {/* SEO Settings */}
          {activeTab === "seo" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  SEO Settings
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Meta Title"
                  value={settings.metaTitle}
                  onChange={(e) => updateSetting("metaTitle", e.target.value)}
                  placeholder="Fashion Store - Your Ultimate Shopping Destination"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={settings.metaDescription}
                    onChange={(e) =>
                      updateSetting("metaDescription", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Shop the latest trends in fashion..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.metaDescription.length}/160 characters
                  </p>
                </div>

                <Input
                  label="Meta Keywords"
                  value={settings.metaKeywords}
                  onChange={(e) =>
                    updateSetting("metaKeywords", e.target.value)
                  }
                  placeholder="fashion, clothing, online shopping"
                />

                {/* SEO Preview */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Google Search Preview
                  </p>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <p className="text-blue-600 text-lg truncate">
                      {settings.metaTitle || "Page Title"}
                    </p>
                    <p className="text-green-700 text-sm">
                      https://yourstore.com
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {settings.metaDescription || "Page description"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Maintenance Settings */}
          {activeTab === "maintenance" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Maintenance Mode
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">
                      Enable Maintenance Mode
                    </p>
                    <p className="text-sm text-gray-600">
                      Your store will be inaccessible to customers
                    </p>
                  </div>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenanceMode
                        ? "bg-primary-500"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      updateSetting(
                        "maintenanceMode",
                        !settings.maintenanceMode,
                      )
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </div>
                </label>

                {settings.maintenanceMode && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-yellow-800 text-sm">
                      Maintenance mode is active. Only admins can access the
                      store. Remember to turn this off when done!
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Message
                  </label>
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) =>
                      updateSetting("maintenanceMessage", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="We are currently under maintenance..."
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} isLoading={isLoading} size="lg">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
