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

  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item)) as T;
  }

  if (doc._id) {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
      ...obj,
      _id: obj._id.toString(),
      createdAt: obj.createdAt
        ? new Date(obj.createdAt).toISOString()
        : undefined,
      updatedAt: obj.updatedAt
        ? new Date(obj.updatedAt).toISOString()
        : undefined,
    } as T;
  }

  if (typeof doc === "object" && doc !== null) {
    const result: any = {};
    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        const value = doc[key];
        if (key === "_id" && value && typeof value === "object") {
          result[key] = value.toString();
        } else if (value instanceof Date) {
          result[key] = value.toISOString();
        } else if (typeof value === "object" && value !== null) {
          result[key] = serializeDoc(value);
        } else {
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
export function serializeProduct(product: any) {
  if (!product) return null;

  try {
    const obj = product.toObject ? product.toObject() : product;

    return {
      _id: obj._id?.toString() || "",
      name: obj.name || "",
      slug: obj.slug || "",
      description: obj.description || "",
      price: obj.price || 0,
      comparePrice: obj.comparePrice || null,
      stock: obj.stock || 0,
      isFeatured: obj.isFeatured || false,
      isActive: obj.isActive || true,
      tags: obj.tags || [],
      category: obj.category?._id
        ? {
            _id: obj.category._id.toString(),
            name: obj.category.name || "",
            slug: obj.category.slug || "",
          }
        : typeof obj.category === "string"
          ? obj.category
          : obj.category?.toString() || "",
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
 * NOTE: Do NOT use spread operator on review object
 * Always explicitly pick fields to avoid non-serializable MongoDB fields
 */
export function serializeReview(review: any) {
  if (!review) return null;

  try {
    // Always convert to plain object first
    const obj = review.toObject ? review.toObject() : review;

    // Explicitly pick only the fields we need
    // DO NOT use spread operator as it copies non-serializable fields
    return {
      _id: obj._id?.toString() || "",
      product: obj.product?._id
        ? obj.product._id.toString()
        : obj.product?.toString() || "",
      user: obj.user?._id
        ? {
            _id: obj.user._id.toString(),
            name: obj.user.name || "Anonymous",
            image: obj.user.image || "",
          }
        : {
            _id: obj.user?.toString() || "",
            name: "Anonymous",
            image: "",
          },
      rating: Number(obj.rating) || 0,
      comment: obj.comment || "",
      isVerifiedPurchase: Boolean(obj.isVerifiedPurchase) || false,
      images: (obj.images || []).map((img: any) => ({
        url: img.url || "",
        publicId: img.publicId || "",
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

  try {
    const obj = order.toObject ? order.toObject() : order;

    return {
      _id: obj._id?.toString() || "",
      orderNumber: obj.orderNumber || "",
      user: obj.user?._id
        ? {
            _id: obj.user._id.toString(),
            name: obj.user.name || "",
            email: obj.user.email || "",
            phone: obj.user.phone || "",
          }
        : {
            _id: obj.user?.toString() || "",
            name: "",
            email: "",
            phone: "",
          },
      items: (obj.items || []).map((item: any) => ({
        _id: item._id ? item._id.toString() : undefined,
        product: item.product?._id
          ? item.product._id.toString()
          : item.product?.toString() || "",
        name: item.name || "",
        image: item.image || "",
        price: item.price || 0,
        quantity: item.quantity || 0,
        size: item.size || "",
        color: item.color || "",
      })),
      shippingAddress: {
        fullName: obj.shippingAddress?.fullName || "",
        phone: obj.shippingAddress?.phone || "",
        addressLine1: obj.shippingAddress?.addressLine1 || "",
        addressLine2: obj.shippingAddress?.addressLine2 || "",
        city: obj.shippingAddress?.city || "",
        state: obj.shippingAddress?.state || "",
        pincode: obj.shippingAddress?.pincode || "",
        country: obj.shippingAddress?.country || "",
      },
      paymentMethod: obj.paymentMethod || "",
      paymentStatus: obj.paymentStatus || "",
      paymentId: obj.paymentId || "",
      orderStatus: obj.orderStatus || "",
      subtotal: obj.subtotal || 0,
      shippingCost: obj.shippingCost || 0,
      tax: obj.tax || 0,
      total: obj.total || 0,
      trackingNumber: obj.trackingNumber || "",
      createdAt: obj.createdAt
        ? new Date(obj.createdAt).toISOString()
        : new Date().toISOString(),
      updatedAt: obj.updatedAt
        ? new Date(obj.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error serializing order:", error);
    return null;
  }
}

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
