"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const handleUpdate = async () => {
    if (status === currentStatus) {
      toast.error("Please select a different status");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success("Order status updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <Button
        fullWidth
        onClick={handleUpdate}
        isLoading={isLoading}
        disabled={status === currentStatus}
      >
        Update Status
      </Button>
    </div>
  );
}
