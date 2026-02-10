"use client";

import { useState, useEffect } from "react";
import { useUIStore } from "@/store";
import { X, Search, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    window.location.href = `/products?search=${encodeURIComponent(query)}`;
    setSearchOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  if (!isSearchOpen) return null;

  const trendingSearches = [
    "Denim Jacket",
    "Summer Dress",
    "Sneakers",
    "T-Shirts",
    "Jeans",
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              autoFocus
              className="w-full pl-14 pr-14 py-5 text-lg border-b border-gray-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </form>

          {/* Search Suggestions */}
          <div className="max-h-96 overflow-y-auto p-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {["Men", "Women", "Kids", "Accessories"].map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    onClick={() => setSearchOpen(false)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center font-medium text-gray-700 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
