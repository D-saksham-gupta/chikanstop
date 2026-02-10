import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import RelatedProducts from "@/components/store/RelatedProducts";
import {
  serializeProduct,
  serializeDoc,
  serializeReview,
} from "@/lib/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  await dbConnect();

  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  // Get reviews for this product
  const reviews = await Review.find({ product: product._id })
    .populate("user", "name image")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Get related products from same category
  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .lean();

  // Convert to plain objects
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
  // const plainReviews = reviews.map((review) => ({
  //   ...review,
  //   _id: review._id.toString(),
  //   product: review.product.toString(),
  //   user: {
  //     _id: review.user._id.toString(),
  //     name: review.user.name,
  //     image: review.user.image,
  //   },
  //   createdAt: review.createdAt.toISOString(),
  //   updatedAt: review.updatedAt.toISOString(),
  // }));

  // Replace plainReviews with:
  const plainReviews = reviews.map(serializeReview);

  // const plainRelatedProducts = relatedProducts.map((p) => ({
  //   ...p,
  //   _id: p._id.toString(),
  //   category: p.category.toString(),
  //   createdAt: p.createdAt.toISOString(),
  //   updatedAt: p.updatedAt.toISOString(),
  // }));

  // Replace plainRelatedProducts with:
  const plainRelatedProducts = relatedProducts.map(serializeProduct);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductDetailClient product={plainProduct} reviews={plainReviews} />
      <RelatedProducts products={plainRelatedProducts} />
    </div>
  );
}
