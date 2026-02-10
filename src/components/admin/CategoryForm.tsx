"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

interface CategoryFormProps {
  initialData?: any;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
  });

  const [images, setImages] = useState<string[]>(
    initialData?.image ? [initialData.image] : [],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Auto-generate slug from name
      if (name === "name" && !initialData) {
        setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        image: images[0] || "", // Use first image or empty string
      };

      const url = initialData
        ? `/api/categories/${initialData.slug}`
        : "/api/categories";

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      toast.success(initialData ? "Category updated!" : "Category created!");
      router.push("/admin/categories");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Category Image</h2>
        <ImageUpload images={images} onImagesChange={setImages} maxImages={1} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Category Information
        </h2>

        <div className="space-y-4">
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Men's Clothing"
            required
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="mens-clothing"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Category description..."
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? "Update Category" : "Create Category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
