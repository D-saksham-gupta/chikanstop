import { requireAdmin } from "@/lib/adminAuth";
import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

export default async function NewProductPage() {
  await requireAdmin();
  await dbConnect();

  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  const plainCategories = categories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">Create a new product listing</p>
      </div>

      <ProductForm categories={plainCategories} />
    </div>
  );
}
