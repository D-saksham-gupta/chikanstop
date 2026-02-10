"use client";

import { useState, useEffect } from "react";
import { Button, Card, Badge, Modal, Input } from "@/components/ui";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    buttonText: "",
    order: 0,
    isActive: true,
  });

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners");
      const data = await response.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload a banner image");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        image: {
          url: images[0],
          publicId: "",
        },
      };

      const url = editingBanner
        ? `/api/banners/${editingBanner._id}`
        : "/api/banners";
      const method = editingBanner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingBanner ? "Banner updated!" : "Banner created!");
        fetchBanners();
        closeModal();
      } else {
        toast.error(data.error || "Failed to save banner");
      }
    } catch (error) {
      toast.error("Failed to save banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Banner deleted successfully");
        fetchBanners();
      } else {
        toast.error(data.error || "Failed to delete banner");
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      link: banner.link || "",
      buttonText: banner.buttonText || "",
      order: banner.order,
      isActive: banner.isActive,
    });
    setImages([banner.image.url]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      link: "",
      buttonText: "",
      order: 0,
      isActive: true,
    });
    setImages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-1">Manage homepage banners</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Banners</p>
          <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {banners.filter((b) => b.isActive).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {banners.filter((b) => !b.isActive).length}
          </p>
        </Card>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No banners found</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Your First Banner
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner._id} className="overflow-hidden">
              <div className="relative h-48">
                <img
                  src={banner.image.url}
                  alt={banner.title || "Banner"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {banner.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="default">Inactive</Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                {banner.title && (
                  <h3 className="font-bold text-gray-900 mb-1">
                    {banner.title}
                  </h3>
                )}
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 mb-3">
                    {banner.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openEditModal(banner)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBanner ? "Edit Banner" : "Add New Banner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={1}
          />

          <Input
            label="Title (Optional)"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Summer Sale"
          />

          <Input
            label="Subtitle (Optional)"
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            placeholder="Up to 50% off on selected items"
          />

          <Input
            label="Link (Optional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="/category/sale"
          />

          <Input
            label="Button Text (Optional)"
            value={formData.buttonText}
            onChange={(e) =>
              setFormData({ ...formData, buttonText: e.target.value })
            }
            placeholder="Shop Now"
          />

          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) })
            }
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-primary-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth isLoading={isLoading}>
              {editingBanner ? "Update Banner" : "Create Banner"}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={closeModal}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
