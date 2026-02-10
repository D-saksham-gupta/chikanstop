"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { SlidersHorizontal, X } from "lucide-react";

interface MobileFilterToggleProps {
  children: React.ReactNode;
}

export default function MobileFilterToggle({
  children,
}: MobileFilterToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        fullWidth
        className="lg:hidden"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filters
      </Button>

      {/* Mobile Filter Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 overflow-y-auto lg:hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6">{children}</div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <Button fullWidth onClick={() => setIsOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
