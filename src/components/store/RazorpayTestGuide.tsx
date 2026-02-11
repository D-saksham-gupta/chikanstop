"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Info, X } from "lucide-react";

export default function RazorpayTestGuide() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
      >
        <Info className="w-4 h-4" />
        Test Payment Guide
      </button>
    );
  }

  return (
    <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Test Payment Details</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-blue-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 text-sm text-blue-900">
        <div>
          <p className="font-medium mb-1">Card Payment:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Card: 5267 3181 8797 5449</li>
            <li>CVV: Any 3 digits (e.g., 123)</li>
            <li>Expiry: Any future date (e.g., 12/25)</li>
            <li>Name: Any name</li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-1">UPI:</p>
          <p className="text-blue-800">UPI ID: success@razorpay</p>
        </div>

        <div>
          <p className="font-medium mb-1">Net Banking:</p>
          <p className="text-blue-800">Select any bank - will auto-succeed</p>
        </div>

        <p className="text-xs text-blue-700 mt-3">
          Note: These are test credentials for development only. In production,
          use real payment methods.
        </p>
      </div>
    </Card>
  );
}
