"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore, useUIStore, useWishlistStore } from "@/store";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { getTotalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { setCartOpen, setSearchOpen } = useUIStore();

  const totalItems = getTotalItems();

  const navigation = [
    { name: "New Arrivals", href: "/category/new-arrivals" },
    { name: "Men", href: "/category/men" },
    { name: "Women", href: "/category/women" },
    { name: "Kids", href: "/category/kids" },
    { name: "Sale", href: "/category/sale" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/banners/logo.jpg"
              alt="Banner1"
              width={1920}
              height={600}
              className="w-12 h-12 object-cover rounded-full"
            />
            <span className="text-2xl font-bold text-gray-900">
              Chikan<span className="text-primary-500">Stop</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden sm:block relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="User Menu"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>

                      {session.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="primary" className="hidden sm:flex">
                  Sign In
                </Button>
                <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100">
                  <User className="w-5 h-5 text-gray-700" />
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
