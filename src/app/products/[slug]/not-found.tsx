import Link from "next/link";
import { Button } from "@/components/ui";
import { Home, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">
              <Search className="w-4 h-4" />
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
