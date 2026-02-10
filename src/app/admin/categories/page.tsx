import { requireAdmin } from "@/lib/adminAuth";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { Plus, Edit } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  await dbConnect();

  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  const plainCategories = categories.map((category) => ({
    ...category,
    _id: category._id.toString(),
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize your products into categories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Categories</p>
          <p className="text-2xl font-bold text-gray-900">
            {plainCategories.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {plainCategories.filter((c) => c.isActive).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600">
            {plainCategories.filter((c) => !c.isActive).length}
          </p>
        </Card>
      </div>

      {/* Categories Grid */}
      {plainCategories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 mb-4">No categories found</p>
          <Link href="/admin/categories/new">
            <Button>
              <Plus className="w-4 h-4" />
              Add Your First Category
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plainCategories.map((category) => (
            <Card
              key={category._id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
                {category.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="default">Inactive</Badge>
                )}
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Link
                  href={`/admin/categories/edit/${category.slug}`}
                  className="flex-1"
                >
                  <Button variant="outline" fullWidth>
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
                <DeleteCategoryButton
                  slug={category.slug}
                  name={category.name}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
