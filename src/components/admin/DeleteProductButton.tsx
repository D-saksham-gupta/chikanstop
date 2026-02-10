"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal, Button } from "@/components/ui";

interface DeleteProductButtonProps {
  slug: string;
  name: string;
}

export default function DeleteProductButton({
  slug,
  name,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      toast.success("Product deleted successfully");
      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{name}</strong>? This action
            cannot be undone.
          </p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleDelete}
              isLoading={isDeleting}
              fullWidth
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
