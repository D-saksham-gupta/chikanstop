import { requireAdmin } from "@/lib/adminAuth";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { serializeProduct, serializeDoc } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();

  const { slug } = await params;

  await dbConnect();

  const product = await Product.findOne({ slug }).populate("category").lean();

  if (!product) {
    notFound();
  }

  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  // const plainProduct = {
  //   ...product,
  //   _id: product._id.toString(),
  //   category: {
  //     _id: product.category._id.toString(),
  //     name: product.category.name,
  //     slug: product.category.slug,
  //   },
  //   createdAt: product.createdAt.toISOString(),
  //   updatedAt: product.updatedAt.toISOString(),
  // };

  const plainProduct = serializeProduct(product);

  // const plainCategories = categories.map((cat) => ({
  //   _id: cat._id.toString(),
  //   name: cat.name,
  //   slug: cat.slug,
  // }));

  const plainCategories = categories.map(serializeDoc);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      <ProductForm categories={plainCategories} initialData={plainProduct} />
    </div>
  );
}
