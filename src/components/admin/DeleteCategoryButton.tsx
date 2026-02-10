"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal, Button } from "@/components/ui";

interface DeleteCategoryButtonProps {
  slug: string;
  name: string;
}

export default function DeleteCategoryButton({
  slug,
  name,
}: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/categories/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category <strong>{name}</strong>
            ? This action cannot be undone.
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
