"use client";

import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";

export default function FeaturedProducts() {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  // Temporary mock data - will be replaced with real data later
  const products = [
    {
      id: "1",
      name: "Classic Denim Jacket",
      price: 2999,
      comparePrice: 3999,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "2",
      name: "Cotton T-Shirt",
      price: 799,
      comparePrice: 1299,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      rating: 4.5,
      reviews: 89,
    },
    {
      id: "3",
      name: "Slim Fit Jeans",
      price: 1999,
      comparePrice: 2999,
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: "4",
      name: "Summer Dress",
      price: 2499,
      comparePrice: 3499,
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      rating: 4.9,
      reviews: 203,
    },
  ];

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: `${product.id}-M-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: "Default",
      quantity: 1,
      stock: 10,
    });
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = (product: (typeof products)[0]) => {
    if (isInWishlist(product.id)) {
      toast.error("Already in wishlist");
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.name.toLowerCase().replace(/\s+/g, "-"),
      });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">Handpicked favorites just for you</p>
          </div>

          <Link href="/products">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
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

                {/* Wishlist Button */}
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-colors ${
                    isInWishlist(product.id)
                      ? "text-red-500"
                      : "hover:bg-primary-500 hover:text-white"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                  />
                </button>

                {/* Quick Add to Cart - Shows on Hover */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button fullWidth onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.comparePrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
