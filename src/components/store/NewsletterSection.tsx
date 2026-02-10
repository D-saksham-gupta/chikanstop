"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Successfully subscribed to newsletter!");
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-linear-to-r from-primary-500 to-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="w-16 h-16 text-white mx-auto mb-6" />

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Join Our Newsletter
        </h2>

        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to get special offers, exclusive deals, and the latest
          updates delivered to your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-6 bg-rose-400 py-3 border border-white rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button
            type="submit"
            variant="secondary"
            isLoading={isLoading}
            className="px-8"
          >
            Subscribe
          </Button>
        </form>

        <p className="text-white/80 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
