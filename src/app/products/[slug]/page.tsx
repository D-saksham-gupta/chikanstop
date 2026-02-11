import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import RelatedProducts from "@/components/store/RelatedProducts";
import { serializeProduct, serializeReview } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Add this to make the page dynamic
export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductDetailPage({ params }: PageProps) {
  try {
    const { slug } = await params;

    await dbConnect();

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!product) {
      notFound();
    }

    // Get reviews for this product
    const reviews = await Review.find({ product: product._id })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();

    // Get related products from same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean()
      .exec();

    // Convert to plain objects using serialization helpers
    const plainProduct = serializeProduct(product);
    const plainReviews = reviews.map(serializeReview).filter(Boolean);
    const plainRelatedProducts = relatedProducts
      .map(serializeProduct)
      .filter(Boolean);

    return (
      <div className="bg-gray-50 min-h-screen">
        <ProductDetailClient product={plainProduct} reviews={plainReviews} />
        <RelatedProducts products={plainRelatedProducts} />
      </div>
    );
  } catch (error) {
    console.error("Product detail page error:", error);
    notFound();
  }
}
