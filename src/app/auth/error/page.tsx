"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

          <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>

          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button fullWidth>Try Again</Button>
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
