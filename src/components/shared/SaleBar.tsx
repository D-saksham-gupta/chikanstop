"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function SaleBar() {
  const [saleBar, setSaleBar] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchSaleBar();
  }, []);

  const fetchSaleBar = async () => {
    try {
      const response = await fetch("/api/salebar");
      const data = await response.json();
      if (data.success && data.data) {
        setSaleBar(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sale bar:", error);
    }
  };

  if (!saleBar || !isVisible) return null;

  const content = (
    <div
      className="py-2 px-4 relative"
      style={{
        backgroundColor: saleBar.backgroundColor,
        color: saleBar.textColor,
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-medium">{saleBar.text}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  if (saleBar.link) {
    return (
      <Link
        href={saleBar.link}
        className="block hover:opacity-90 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
