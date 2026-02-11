"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Oops!</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600">
            We couldn't load this product. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/products">
            <Button variant="outline">Browse All Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
