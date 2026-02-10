// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    publicId: string;
  }[];
  sizes: {
    size: string;
    stock: number;
  }[];
  colors: {
    name: string;
    hexCode: string;
  }[];
  stock: number;
  ratings: {
    average: number;
    count: number;
  };
  isFeatured: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  rating: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: "COD" | "Card" | "UPI" | "Wallet";
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  phone?: string;
  address: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// Banner Types
export interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: {
    url: string;
    publicId: string;
  };
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Sale Bar Types
export interface SaleBar {
  _id: string;
  text: string;
  link?: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
