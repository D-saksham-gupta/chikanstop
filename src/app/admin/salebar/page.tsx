"use client";

import { useState, useEffect } from "react";
import { Button, Card, Input } from "@/components/ui";
import { Megaphone, Save, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSaleBarPage() {
  const [saleBar, setSaleBar] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    link: "",
    backgroundColor: "#000000",
    textColor: "#ffffff",
  });

  useEffect(() => {
    fetchSaleBar();
  }, []);

  const fetchSaleBar = async () => {
    try {
      const response = await fetch("/api/salebar");
      const data = await response.json();
      if (data.success && data.data) {
        setSaleBar(data.data);
        setFormData({
          text: data.data.text,
          link: data.data.link || "",
          backgroundColor: data.data.backgroundColor,
          textColor: data.data.textColor,
        });
      }
    } catch (error) {
      console.error("Failed to fetch sale bar:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/salebar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isActive: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Sale bar updated successfully");
        fetchSaleBar();
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update sale bar");
      }
    } catch (error) {
      toast.error("Failed to update sale bar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate the sale bar?")) return;

    try {
      const response = await fetch("/api/salebar", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Sale bar deactivated successfully");
        setSaleBar(null);
      } else {
        toast.error(data.error || "Failed to deactivate sale bar");
      }
    } catch (error) {
      toast.error("Failed to deactivate sale bar");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sale Bar</h1>
        <p className="text-gray-600 mt-1">
          Manage the promotional bar at the top of your store
        </p>
      </div>

      {/* Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
        {saleBar ? (
          <div
            className="py-3 px-4 rounded-lg text-center"
            style={{
              backgroundColor: saleBar.backgroundColor,
              color: saleBar.textColor,
            }}
          >
            <p className="font-medium">{saleBar.text}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No active sale bar</p>
          </div>
        )}
      </Card>

      {/* Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {saleBar ? "Edit Sale Bar" : "Create Sale Bar"}
          </h2>
          {saleBar && !isEditing && (
            <div className="flex gap-3">
              <Button onClick={() => setIsEditing(true)}>
                <Save className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDeactivate}>
                <X className="w-4 h-4" />
                Deactivate
              </Button>
            </div>
          )}
        </div>

        {(!saleBar || isEditing) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Text
              </label>
              <textarea
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="🎉 SALE: Up to 50% OFF on Selected Items! Shop Now →"
                required
              />
            </div>

            <Input
              label="Link (Optional)"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="/category/sale"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) =>
                      setFormData({ ...formData, textColor: e.target.value })
                    }
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={formData.textColor}
                    onChange={(e) =>
                      setFormData({ ...formData, textColor: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" fullWidth isLoading={isLoading}>
                <Save className="w-4 h-4" />
                Save Sale Bar
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
