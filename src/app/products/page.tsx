import { Suspense } from "react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductsGrid from "@/components/store/ProductsGrid";
import ProductsFilters from "@/components/store/ProductsFilters";
import MobileFilterToggle from "@/components/store/MobileFilterToggle";
import { LoadingSpinner } from "@/components/ui";
import {
  serializeProduct,
  serializeDoc,
  serializeCategory,
  filterNull,
} from "@/lib/serialize";

interface PageProps {
  searchParams: Promise<{
    category?: string;
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

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  await dbConnect();

  // Get all categories for filters
  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  const plainCategories = categories.map(serializeCategory);

  // Build query
  const query: any = { isActive: true };
  const page = parseInt(params.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  if (params.category) {
    const category = await Category.findOne({ slug: params.category });
    if (category) {
      query.category = category._id;
    }
  }

  if (params.search) {
    query.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
      { tags: { $in: [new RegExp(params.search, "i")] } },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = parseFloat(params.minPrice);
    if (params.maxPrice) query.price.$lte = parseFloat(params.maxPrice);
  }

  if (params.minRating) {
    query["ratings.average"] = { $gte: parseFloat(params.minRating) };
  }

  if (params.sizes) {
    const sizes = params.sizes.split(",");
    query["sizes.size"] = { $in: sizes };
  }

  if (params.colors) {
    const colors = params.colors.split(",");
    query["colors.name"] = { $in: colors };
  }

  // Sort
  let sortOption: any = { createdAt: -1 };
  switch (params.sort) {
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

  //const plainProducts = products.map(serializeProduct);
  const plainProducts = filterNull(products.map(serializeProduct));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            Showing {plainProducts.length} of {total} products
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <MobileFilterToggle>
            <ProductsFilters categories={plainCategories} />
          </MobileFilterToggle>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
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
