"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { X, Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/utils";
import ImageUpload from "./ImageUpload";

// Add state for images

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    category: initialData?.category?._id || "",
    stock: initialData?.stock || "",
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive ?? true,
    tags: initialData?.tags?.join(", ") || "",
  });

  const [sizes, setSizes] = useState<Array<{ size: string; stock: number }>>(
    initialData?.sizes || [{ size: "M", stock: 0 }],
  );

  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.url) || [],
  );

  const [colors, setColors] = useState<
    Array<{ name: string; hexCode: string }>
  >(initialData?.colors || []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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

  const addSize = () => {
    setSizes([...sizes, { size: "", stock: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: "size" | "stock",
    value: string | number,
  ) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  const addColor = () => {
    setColors([...colors, { name: "", hexCode: "#000000" }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (
    index: number,
    field: "name" | "hexCode",
    value: string,
  ) => {
    const updated = [...colors];
    updated[index] = { ...updated[index], [field]: value };
    setColors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice)
          : undefined,
        stock: parseInt(formData.stock),
        sizes,
        colors,
        tags: formData.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        images: images.map((url) => ({ url, publicId: "" })), // Add this line
      };

      const url = initialData
        ? `/api/products/${initialData.slug}`
        : "/api/products";

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      toast.success(initialData ? "Product updated!" : "Product created!");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Basic Information
        </h2>

        <div className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Classic Denim Jacket"
            required
          />

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="classic-denim-jacket"
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
              placeholder="Product description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="2999"
            required
          />

          <Input
            label="Compare Price (₹)"
            name="comparePrice"
            type="number"
            value={formData.comparePrice}
            onChange={handleChange}
            placeholder="3999"
          />
        </div>
      </Card>

      {/* Inventory */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory</h2>

        <Input
          label="Stock Quantity"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          placeholder="100"
          required
        />

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Images
          </h2>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={5}
          />
        </Card>

        {/* Sizes */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Sizes & Stock
            </label>
            <Button type="button" variant="outline" size="sm" onClick={addSize}>
              <Plus className="w-4 h-4" />
              Add Size
            </Button>
          </div>

          <div className="space-y-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={size.size}
                  onChange={(e) => updateSize(index, "size", e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>

                <input
                  type="number"
                  value={size.stock}
                  onChange={(e) =>
                    updateSize(index, "stock", parseInt(e.target.value))
                  }
                  placeholder="Stock"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">Colors</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColor}
            >
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          </div>

          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(index, "name", e.target.value)}
                  placeholder="Color name (e.g., Black)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                <input
                  type="color"
                  value={color.hexCode}
                  onChange={(e) =>
                    updateColor(index, "hexCode", e.target.value)
                  }
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Additional Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Additional Settings
        </h2>

        <div className="space-y-4">
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="denim, jacket, casual"
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured Product
              </span>
            </label>

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
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          {initialData ? "Update Product" : "Create Product"}
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
