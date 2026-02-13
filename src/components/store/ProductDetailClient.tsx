"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";
import ReviewForm from "./ReviewForm";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: Array<{ url: string; publicId: string }>;
  sizes: Array<{ size: string; stock: number }>;
  colors: Array<{ name: string; hexCode: string }>;
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user:
    | {
        _id: string;
        name: string;
        image?: string;
      }
    | string; // Allow string for cases where user is not populated
  createdAt: string;
  isVerifiedPurchase: boolean;
  images?: any[];
}

interface ProductDetailClientProps {
  product: Product;
  reviews: Review[];
}

export default function ProductDetailClient({
  product,
  reviews,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0]?.size || "",
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || "",
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const sizeStock =
      product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

    if (quantity > sizeStock) {
      toast.error("Not enough stock available");
      return;
    }

    addItem({
      id: `${product._id}-${selectedSize}-${selectedColor}`,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      size: selectedSize,
      color: selectedColor,
      quantity,
      stock: sizeStock,
    });

    toast.success("Added to cart!");
  };

  const handleToggleWishlist = () => {
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

  const selectedSizeStock =
    product.sizes.find((s) => s.size === selectedSize)?.stock || 0;
  const discount = product.comparePrice
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-primary-500">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary-500">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-primary-500"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-8"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-xl p-8 mb-12">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4">
            {product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-linear-to-br from-primary-400 to-primary-600"></div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Title & Category */}
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm text-primary-500 hover:underline mb-2 block"
          >
            {product.category.name}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.ratings.average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-gray-900">
                {product.ratings.average.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              ({product.ratings.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.comparePrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.comparePrice}
                </span>
                <Badge variant="success">{discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => setSelectedSize(size.size)}
                    disabled={size.stock === 0}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                      selectedSize === size.size
                        ? "bg-primary-500 text-white border-primary-500"
                        : size.stock === 0
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:border-primary-500"
                    }`}
                  >
                    {size.size}
                    {size.stock === 0 && (
                      <span className="block text-xs">Out of Stock</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Select Color
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                      selectedColor === color.name
                        ? "border-primary-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="font-medium text-gray-900">
                      {color.name}
                    </span>
                    {selectedColor === color.name && (
                      <Check className="w-4 h-4 text-primary-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-16 text-center font-medium text-lg">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(selectedSizeStock, quantity + 1))
                }
                disabled={quantity >= selectedSizeStock}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 ml-2">
                {selectedSizeStock} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || !selectedSize}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              size="lg"
              className={
                isInWishlist(product._id) ? "text-red-500 border-red-500" : ""
              }
            >
              <Heart
                className="w-5 h-5"
                fill={isInWishlist(product._id) ? "currentColor" : "none"}
              />
            </Button>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Truck className="w-5 h-5 text-primary-500" />
              <span className="text-sm">
                Free shipping on orders above ₹999
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <RefreshCw className="w-5 h-5 text-primary-500" />
              <span className="text-sm">Easy 30-day returns</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Shield className="w-5 h-5 text-primary-500" />
              <span className="text-sm">100% Authentic Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Customer Reviews ({reviews.length})
          </h2>
          <Button onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Write Your Review
            </h3>
            <ReviewForm
              productId={product._id}
              onSuccess={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No reviews yet. Be the first to review!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => {
              // Handle user being either object or string
              const userName =
                typeof review.user === "object"
                  ? review.user.name
                  : "Anonymous";

              return (
                <div
                  key={review._id}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-700 font-medium">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {review.isVerifiedPurchase && (
                      <Badge variant="success">Verified Purchase</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700">{review.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
