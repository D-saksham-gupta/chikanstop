import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import RelatedProducts from "@/components/store/RelatedProducts";
import { serializeProduct, filterNull } from "@/lib/serialize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

// Inline review serializer to avoid any issues
function safeSerializeReview(review: any) {
  try {
    if (!review) return null;

    const obj = review.toObject ? review.toObject() : { ...review };

    // Safely get user data
    let userData = { _id: "", name: "Anonymous", image: "" };
    if (obj.user) {
      if (typeof obj.user === "object" && obj.user._id) {
        userData = {
          _id: obj.user._id.toString(),
          name: obj.user.name || "Anonymous",
          image: obj.user.image || "",
        };
      } else if (typeof obj.user === "string") {
        userData = { _id: obj.user, name: "Anonymous", image: "" };
      }
    }

    // Safely get product id
    let productId = "";
    if (obj.product) {
      if (typeof obj.product === "object" && obj.product._id) {
        productId = obj.product._id.toString();
      } else if (typeof obj.product === "string") {
        productId = obj.product;
      } else {
        productId = obj.product.toString();
      }
    }

    return {
      _id: obj._id ? obj._id.toString() : "",
      product: productId,
      user: userData,
      rating: Number(obj.rating) || 0,
      comment: obj.comment || "",
      isVerifiedPurchase: Boolean(obj.isVerifiedPurchase) || false,
      images: [],
      createdAt: obj.createdAt
        ? new Date(obj.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: obj.updatedAt
        ? new Date(obj.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Review serialization failed:", error, review);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  try {
    const { slug } = await params;

    if (!slug) {
      notFound();
    }

    await dbConnect();

    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!product) {
      notFound();
    }

    // Serialize product first - if this fails, show not found
    const plainProduct = serializeProduct(product);

    if (!plainProduct) {
      console.error("Failed to serialize product:", slug);
      notFound();
    }

    // Get reviews - handle errors gracefully
    let plainReviews: any[] = [];
    try {
      const reviews = await Review.find({ product: product._id })
        .populate("user", "name image")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .exec();

      plainReviews = reviews
        .map(safeSerializeReview)
        .filter((r): r is NonNullable<typeof r> => r !== null);
    } catch (reviewError) {
      console.error("Failed to fetch reviews:", reviewError);
      // Don't fail the whole page if reviews fail
      plainReviews = [];
    }

    // Get related products - handle errors gracefully
    let plainRelatedProducts: any[] = [];
    try {
      const categoryId = product.category?._id || product.category;

      if (categoryId) {
        const relatedProducts = await Product.find({
          category: categoryId,
          _id: { $ne: product._id },
          isActive: true,
        })
          .limit(4)
          .lean()
          .exec();

        plainRelatedProducts = filterNull(
          relatedProducts.map(serializeProduct),
        );
      }
    } catch (relatedError) {
      console.error("Failed to fetch related products:", relatedError);
      // Don't fail the whole page if related products fail
      plainRelatedProducts = [];
    }

    return (
      <div className="bg-gray-50 min-h-screen">
        <ProductDetailClient product={plainProduct} reviews={plainReviews} />
        {plainRelatedProducts.length > 0 && (
          <RelatedProducts products={plainRelatedProducts} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Product detail page fatal error:", error);
    notFound();
  }
}
