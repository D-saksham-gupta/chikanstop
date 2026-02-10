"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Home, User } from "lucide-react";

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 hover:text-primary-500"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Store</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
