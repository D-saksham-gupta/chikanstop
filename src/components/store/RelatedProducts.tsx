"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: Array<{ url: string; publicId: string }>;
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  sizes: Array<{ size: string; stock: number }>;
  colors: Array<{ name: string; hexCode: string }>;
}

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const { addItem } = useCartStore();

  if (products.length === 0) return null;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        You May Also Like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
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
              </div>
            </Link>

            <div className="p-4">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500">
                  {product.name}
                </h3>
              </Link>

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
    </div>
  );
}
