"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ecommerce_products"); // Create this in Cloudinary
        formData.append("folder", "ecommerce/products");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await response.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      onImagesChange([...images, ...uploadedUrls]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Product Images ({images.length}/{maxImages})
      </label>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {uploading ? (
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-3" />
            ) : (
              <Upload className="w-10 h-10 text-gray-400 mb-3" />
            )}
            <p className="text-sm text-gray-600 mb-1">
              {uploading ? "Uploading..." : "Click to upload images"}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </label>
        </div>
      )}
    </div>
  );
}
