"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductsFiltersProps {
  categories: Category[];
}

export default function ProductsFilters({ categories }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const ratings = [4, 3, 2, 1];

  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  const updateMultiFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",").filter(Boolean) || [];

    if (current.includes(value)) {
      const updated = current.filter((v) => v !== value);
      if (updated.length > 0) {
        params.set(key, updated.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.set(key, [...current, value].join(","));
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "page" && key !== "sort",
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-6 lg:sticky lg:top-20">
      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex items-center justify-between pb-4 border-b">
          <span className="font-semibold text-gray-900">Filters</span>
          <Button variant="ghost" onClick={clearFilters}>
            <X className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!searchParams.get("category")}
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("category");
                params.delete("page");
                router.push(`/products?${params.toString()}`);
              }}
              className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                checked={searchParams.get("category") === category.slug}
                onChange={() => updateFilter("category", category.slug)}
                className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button variant="outline" fullWidth onClick={applyPriceFilter}>
            Apply
          </Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isSelected = searchParams
              .get("sizes")
              ?.split(",")
              .includes(size);

            return (
              <button
                key={size}
                onClick={() => updateMultiFilter("sizes", size)}
                className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                  isSelected
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!searchParams.get("minRating")}
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("minRating");
                params.delete("page");
                router.push(`/products?${params.toString()}`);
              }}
              className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">All Ratings</span>
          </label>
          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={searchParams.get("minRating") === rating.toString()}
                onChange={() => updateFilter("minRating", rating.toString())}
                className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{rating}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
