"use client";

import { useWishlistStore } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: `${item.productId}-M-default`,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      size: "M", // Default size
      color: "Default", // Default color
      quantity: 1,
      stock: 10, // Assume stock available
    });
    toast.success("Added to cart!");
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
    toast.success("Removed from wishlist");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save your favorite items to your wishlist and shop them later.
            </p>
            <Link href="/products">
              <Button size="lg">
                <ShoppingCart className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {items.length} item{items.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              {/* Product Image */}
              <Link href={`/products/${item.slug}`}>
                <div className="relative h-64 bg-gray-200 overflow-hidden group">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div>
                  )}

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.productId);
                    }}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                    />
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500">
                    {item.name}
                  </h3>
                </Link>

                <p className="text-xl font-bold text-gray-900 mb-4">
                  ₹{item.price}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button fullWidth onClick={() => handleAddToCart(item)}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Move All to Cart */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={() => {
              items.forEach((item) => handleAddToCart(item));
              toast.success("All items added to cart!");
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Move All to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
