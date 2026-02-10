import { requireAdmin } from "@/lib/adminAuth";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { Plus, Edit, Eye } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { serializeProduct } from "@/lib/serialize";

export default async function AdminProductsPage() {
  await requireAdmin();
  await dbConnect();

  const products = await Product.find({})
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB documents to plain objects
  // const plainProducts = products.map((product) => ({
  //   ...product,
  //   _id: product._id.toString(),
  //   category: {
  //     _id: product.category._id.toString(),
  //     name: product.category.name,
  //   },
  //   sizes: product.sizes?.map((s: any) => ({
  //     ...s,
  //     _id: s._id.toString(),
  //   })),

  //   createdAt: product.createdAt.toISOString(),
  //   updatedAt: product.updatedAt.toISOString(),
  // }));

  const plainProducts = products.map(serializeProduct);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">
            {plainProducts.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">
            {plainProducts.filter((p) => p.isActive).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {plainProducts.filter((p) => p.stock === 0).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Featured</p>
          <p className="text-2xl font-bold text-primary-500">
            {plainProducts.filter((p) => p.isFeatured).length}
          </p>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        {plainProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4" />
                Add Your First Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plainProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-primary-400 to-primary-600"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          ₹{product.price}
                        </p>
                        {product.comparePrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ₹{product.comparePrice}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">Inactive</Badge>
                        )}
                        {product.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                        >
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </Link>
                        <Link href={`/admin/products/edit/${product.slug}`}>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                        </Link>
                        <DeleteProductButton
                          slug={product.slug}
                          name={product.name}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
