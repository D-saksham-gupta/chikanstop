import { requireAdmin } from "@/lib/adminAuth";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-600 mt-1">Create a new product category</p>
      </div>

      <CategoryForm />
    </div>
  );
}
