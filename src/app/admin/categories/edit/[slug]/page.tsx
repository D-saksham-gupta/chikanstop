import { requireAdmin } from "@/lib/adminAuth";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  await requireAdmin();

  const { slug } = await params;

  await dbConnect();

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    notFound();
  }

  const plainCategory = {
    ...category,
    _id: category._id.toString(),
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600 mt-1">Update category information</p>
      </div>

      <CategoryForm initialData={plainCategory} />
    </div>
  );
}
