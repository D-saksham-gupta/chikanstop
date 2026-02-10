"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Image,
  Megaphone,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: Image,
    },
    {
      name: "Sale Bar",
      href: "/admin/salebar",
      icon: Megaphone,
    },
    // {
    //   name: "Analytics",
    //   href: "/admin/analytics",
    //   icon: BarChart3,
    // },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
      </div>

      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
