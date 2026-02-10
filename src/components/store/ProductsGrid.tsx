"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: Array<{ url: string; publicId: string }>;
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  sizes: Array<{ size: string; stock: number }>;
  colors: Array<{ name: string; hexCode: string }>;
}

interface ProductsGridProps {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function ProductsGrid({
  products,
  total,
  currentPage,
  totalPages,
}: ProductsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page"); // Reset to first page
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0]?.size || "M";
    const defaultColor = product.colors[0]?.name || "Default";

    addItem({
      id: `${product._id}-${defaultSize}-${defaultColor}`,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      toast.error("Already in wishlist");
    } else {
      addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "",
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 mb-4">No products found</p>
        <p className="text-gray-500 mb-8">Try adjusting your filters</p>
        <Link href="/products">
          <Button>Clear Filters</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort Bar */}
      <div className="bg-white rounded-lg p-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {total} product{total !== 1 ? "s" : ""} found
        </p>

        <select
          onChange={(e) => handleSortChange(e.target.value)}
          value={searchParams.get("sort") || "newest"}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <Link href={`/products/${product.slug}`}>
              <div className="relative overflow-hidden bg-gray-200 h-64">
                {product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div>
                )}

                {/* Discount Badge */}
                {product.comparePrice && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(
                        ((product.comparePrice - product.price) /
                          product.comparePrice) *
                          100,
                      )}
                      % OFF
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleWishlist(product);
                  }}
                  className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-colors ${
                    isInWishlist(product._id)
                      ? "text-red-500"
                      : "hover:bg-primary-500 hover:text-white"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/products/${product.slug}`}>
                <p className="text-xs text-gray-500 mb-1">
                  {product.category.name}
                </p>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.ratings.average.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.ratings.count})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.comparePrice}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <Button
                fullWidth
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
