export interface PlainCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Serialize MongoDB documents to plain objects
 * Handles _id conversion and removes non-serializable properties
 */
export function serializeDoc<T>(doc: any): T {
  if (!doc) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item)) as T;
  }

  // Handle MongoDB documents
  if (doc._id) {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      ...obj,
      _id: obj._id.toString(),
      createdAt: obj.createdAt ? obj.createdAt.toISOString() : undefined,
      updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : undefined,
    } as T;
  }

  // Handle plain objects
  if (typeof doc === "object" && doc !== null) {
    const result: any = {};
    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        const value = doc[key];

        // Convert _id fields to strings
        if (key === "_id" && value && typeof value === "object") {
          result[key] = value.toString();
        }
        // Convert Date objects to ISO strings
        else if (value instanceof Date) {
          result[key] = value.toISOString();
        }
        // Recursively serialize nested objects
        else if (typeof value === "object" && value !== null) {
          result[key] = serializeDoc(value);
        }
        // Keep primitive values as-is
        else {
          result[key] = value;
        }
      }
    }
    return result as T;
  }

  return doc;
}

/**
 * Serialize product with proper type handling
 */
/**
 * Serialize product with proper type handling
 */
export function serializeProduct(product: any) {
  if (!product) return null;

  try {
    const obj = product.toObject ? product.toObject() : product;

    return {
      ...obj,
      _id: obj._id?.toString() || "",
      category: obj.category?._id
        ? {
            _id: obj.category._id.toString(),
            name: obj.category.name || "",
            slug: obj.category.slug || "",
          }
        : typeof obj.category === "string"
          ? obj.category
          : "",
      sizes: (obj.sizes || []).map((s: any) => ({
        size: s.size || "",
        stock: s.stock || 0,
        _id: s._id ? s._id.toString() : undefined,
      })),
      colors: (obj.colors || []).map((c: any) => ({
        name: c.name || "",
        hexCode: c.hexCode || "#000000",
        _id: c._id ? c._id.toString() : undefined,
      })),
      images: (obj.images || []).map((img: any) => ({
        url: img.url || "",
        publicId: img.publicId || "",
        _id: img._id ? img._id.toString() : undefined,
      })),
      ratings: {
        average: obj.ratings?.average || 0,
        count: obj.ratings?.count || 0,
      },
      createdAt: obj.createdAt
        ? new Date(obj.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: obj.updatedAt
        ? new Date(obj.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error serializing product:", error);
    return null;
  }
}

/**
 * Serialize review with proper type handling
 */
export function serializeReview(review: any) {
  if (!review) return null;

  try {
    const obj = review.toObject ? review.toObject() : review;

    return {
      ...obj,
      _id: obj._id?.toString() || "",
      product: obj.product?._id
        ? obj.product._id.toString()
        : typeof obj.product === "string"
          ? obj.product
          : "",
      user: obj.user?._id
        ? {
            _id: obj.user._id.toString(),
            name: obj.user.name || "Anonymous",
            image: obj.user.image || "",
          }
        : typeof obj.user === "string"
          ? obj.user
          : "",
      rating: obj.rating || 0,
      comment: obj.comment || "",
      isVerifiedPurchase: obj.isVerifiedPurchase || false,
      images: (obj.images || []).map((img: any) => ({
        url: img.url || "",
        publicId: img.publicId || "",
        _id: img._id ? img._id.toString() : undefined,
      })),
      createdAt: obj.createdAt
        ? new Date(obj.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: obj.updatedAt
        ? new Date(obj.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error serializing review:", error);
    return null;
  }
}

/**
 * Serialize order with proper type handling
 */
export function serializeOrder(order: any) {
  if (!order) return null;

  const obj = order.toObject ? order.toObject() : order;

  return {
    ...obj,
    _id: obj._id.toString(),
    user: obj.user?._id
      ? {
          _id: obj.user._id.toString(),
          name: obj.user.name,
          email: obj.user.email,
          phone: obj.user.phone,
        }
      : obj.user?.toString(),
    items:
      obj.items?.map((item: any) => ({
        ...item,
        _id: item._id ? item._id.toString() : undefined,
        product: item.product?._id
          ? item.product._id.toString()
          : item.product?.toString(),
      })) || [],
    createdAt: obj.createdAt
      ? obj.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: obj.updatedAt
      ? obj.updatedAt.toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Serialize review with proper type handling
 */

export function serializeCategory(category: any): PlainCategory {
  if (!category) {
    throw new Error("serializeCategory: category is required");
  }

  const obj = category.toObject ? category.toObject() : category;

  return {
    _id: obj._id.toString(),
    name: obj.name,
    slug: obj.slug,
    description: obj.description,
    image: obj.image,
    isActive: obj.isActive ?? true,
    createdAt: obj.createdAt ? obj.createdAt.toISOString() : undefined,
    updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : undefined,
  };
}
