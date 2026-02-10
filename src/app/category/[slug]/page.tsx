import { notFound } from "next/navigation";
import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductsGrid from "@/components/store/ProductsGrid";
import ProductsFilters from "@/components/store/ProductsFilters";
import { LoadingSpinner } from "@/components/ui";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { serializeProduct } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sizes?: string;
    colors?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const filters = await searchParams;

  await dbConnect();

  // Get the category
  const category = await Category.findOne({ slug, isActive: true }).lean();

  if (!category) {
    notFound();
  }

  // Get all categories for filters
  const allCategories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  const plainCategories = allCategories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  // Build query
  const query: any = {
    category: category._id,
    isActive: true,
  };

  const page = parseInt(filters.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { tags: { $in: [new RegExp(filters.search, "i")] } },
    ];
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
  }

  if (filters.minRating) {
    query["ratings.average"] = { $gte: parseFloat(filters.minRating) };
  }

  if (filters.sizes) {
    const sizes = filters.sizes.split(",");
    query["sizes.size"] = { $in: sizes };
  }

  if (filters.colors) {
    const colors = filters.colors.split(",");
    query["colors.name"] = { $in: colors };
  }

  // Sort
  let sortOption: any = { createdAt: -1 };
  switch (filters.sort) {
    case "price-low":
      sortOption = { price: 1 };
      break;
    case "price-high":
      sortOption = { price: -1 };
      break;
    case "rating":
      sortOption = { "ratings.average": -1 };
      break;
    case "popular":
      sortOption = { "ratings.count": -1 };
      break;
  }

  // Fetch products
  const products = await Product.find(query)
    .populate("category", "name slug")
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Product.countDocuments(query);

  // const plainProducts = products.map((product) => ({
  //   ...product,
  //   _id: product._id.toString(),
  //   category: {
  //     _id: product.category._id.toString(),
  //     name: product.category.name,
  //     slug: product.category.slug,
  //   },
  //   createdAt: product.createdAt
  //     ? new Date(product.createdAt).toISOString()
  //     : new Date().toISOString(),
  //   updatedAt: product.updatedAt
  //     ? new Date(product.updatedAt).toISOString()
  //     : new Date().toISOString(),
  // }));
  const plainProducts = products.map(serializeProduct);
  const plainCategory = {
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    image: category.image || "",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-500">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary-500">
            Products
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{plainCategory.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8 bg-white rounded-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {plainCategory.name}
          </h1>
          {plainCategory.description && (
            <p className="text-lg text-gray-600">{plainCategory.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {total} product{total !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsFilters categories={plainCategories} />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsGrid
                products={plainProducts}
                total={total}
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
