"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export default function AuthAPIErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  console.log("Auth Error:", error); // For debugging

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h2>

          <p className="text-gray-600 mb-2">
            Error: {error || "Unknown error"}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Please check the browser console for more details.
          </p>

          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button fullWidth>Back to Sign In</Button>
            </Link>

            <Link href="/">
              <Button variant="outline" fullWidth>
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
