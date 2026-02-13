"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui";
import { useCartStore, useWishlistStore } from "@/store";
import toast from "react-hot-toast";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any>({
    products: [],
    categories: [],
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [page, setPage] = useState(1);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const fetchResults = useCallback(async (q: string, p = 1) => {
    if (!q.trim()) {
      setResults({ products: [], categories: [], total: 0, totalPages: 1 });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&page=${p}&limit=12`,
      );
      const data = await response.json();

      if (data.success) {
        if (p === 1) {
          setResults(data.data);
        } else {
          setResults((prev: any) => ({
            ...data.data,
            products: [...prev.products, ...data.data.products],
          }));
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchInput(query);
    setPage(1);
    fetchResults(query, 1);
  }, [query, fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `${product._id}-default`,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      size: "M",
      color: "Default",
      quantity: 1,
      stock: product.stock || 10,
    });
    toast.success("Added to cart!");
  };

  const handleWishlist = (product: any) => {
    if (isInWishlist(product._id)) {
      toast("Already in wishlist");
    } else {
      addToWishlist({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(query, nextPage);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-16 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 bg-white shadow-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    router.push("/search");
                  }}
                  className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-500 text-white px-4 py-2 rounded-xl hover:bg-primary-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* No Query State */}
        {!query && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search our store
            </h2>
            <p className="text-gray-600">
              Enter a search term above to find products
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && page === 1 && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        )}

        {/* Results */}
        {query && !loading && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {results.total > 0
                  ? `${results.total} results for "${query}"`
                  : `No results for "${query}"`}
              </h1>
            </div>

            {/* Category Pills */}
            {results.categories?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h2>
                <div className="flex flex-wrap gap-3">
                  {results.categories.map((category: any) => (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-primary-500 rounded-full font-medium text-gray-900 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.products?.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h2>
                <p className="text-gray-600 mb-6">
                  Try different keywords or browse our categories
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/products">
                    <Button>Browse All Products</Button>
                  </Link>
                  <Link href="/category/sale">
                    <Button variant="outline">View Sale Items</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {results.products?.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.products.map((product: any) => (
                    <div
                      key={product._id}
                      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600" />
                          )}

                          {product.comparePrice > product.price && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {Math.round(
                                  ((product.comparePrice - product.price) /
                                    product.comparePrice) *
                                    100,
                                )}
                                % OFF
                              </span>
                            </div>
                          )}

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishlist(product);
                            }}
                            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isInWishlist(product._id)
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }`}
                            />
                          </button>

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-full text-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        {product.category && (
                          <p className="text-xs text-primary-500 font-medium mb-1 uppercase tracking-wide">
                            {product.category.name}
                          </p>
                        )}

                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {product.ratings?.count > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {product.ratings.average.toFixed(1)} (
                              {product.ratings.count})
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.comparePrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.comparePrice}
                            </span>
                          )}
                        </div>

                        <Button
                          fullWidth
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {page < results.totalPages && (
                  <div className="text-center mt-10">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={loadMore}
                      isLoading={loading}
                    >
                      Load More Results
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
