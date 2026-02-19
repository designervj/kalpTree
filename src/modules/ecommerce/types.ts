import { BaseDocument } from '@/types';
import { ObjectId } from 'mongodb';

// Universal Product Type
export interface Product extends BaseDocument {
  // Basic Info
  name: string;
  slug: string;
  sku?: string;
  description: string;
  shortDescription?: string;

  // Product Type
  productType: 'physical' | 'digital' | 'service' | 'booking' | 'rental';

  // Media
  images: string[];
  featuredImage?: string;

  // Pricing
  pricing: {
    basePrice: number;
    salePrice?: number;
    costPrice?: number; // For profit tracking
  };

  // Inventory (for physical products)
  inventory?: {
    trackStock: boolean;
    stockQuantity?: number;
    lowStockThreshold?: number;
    allowBackorder: boolean;
  };

  // Flexible Attributes System
  attributes: ProductAttribute[];

  // Type-specific data
  typeSpecific: PhysicalProduct | DigitalProduct | ServiceProduct | BookingProduct | RentalProduct;

  // Categories & Tags
  categoryIds: string[];
  tags: string[];

  // SEO
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
}

// Flexible attribute system
export interface ProductAttribute {
  name: string; // "Size", "Color", "Duration"
  type: 'text' | 'select' | 'number' | 'boolean' | 'date';
  value: string | number | boolean | Date;
  options?: string[]; // For select type
  unit?: string; // "kg", "hours", "meters"
}

// Type-specific interfaces
export interface PhysicalProduct {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  shipping?: {
    requiresShipping: boolean;
    shippingClass?: string;
    freeShipping?: boolean;
  };
}

export interface DigitalProduct {
  downloadable: true;
  fileUrl?: string;
  fileSize?: number;
  downloadLimit?: number; // Max downloads per purchase
  downloadExpiry?: number; // Days until download expires
}

export interface ServiceProduct {
  duration?: number; // Service duration in minutes
  location?: 'online' | 'onsite' | 'hybrid';
  requiresAppointment: boolean;
}

export interface BookingProduct {
  bookingType: 'appointment' | 'event' | 'reservation';
  duration?: number; // Duration in minutes
  availableSlots?: BookingSlot[];
  maxParticipants?: number;
  cancellationPolicy?: string;
}

export interface RentalProduct {
  rentalPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly';
  minRentalPeriod?: number; // Minimum rental duration
  maxRentalPeriod?: number;
  securityDeposit?: number;
  lateFee?: number; // Per day/hour
}

export interface BookingSlot {
  date: Date;
  startTime: string; // "09:00"
  endTime: string; // "16:00"
  available: boolean;
  price?: number; // Override base price
}


export interface NewProductAttribute{
  attributeId:string|ObjectId,
  attributeName?:string,
  value?:string,
  weight?:number,

}
// Product Variant (for products with options like Size/Color)
export interface ProductVariant  {
  _id:string,
  id?:number,
  sku?:string,
  stock?:number,
  price?:string,
  weight?:number,
  productId?:string|ObjectId,
  attributes?:NewProductAttribute[],
createdAt?:Date,
updatedAt?:Date,
  
  // productId: string;
  // sku?: string;
  // name: string; // "Large / Red"
  // options: {
  //   [key: string]: string; // { Size: "Large", Color: "Red" }
  // };
  // pricing: {
  //   basePrice: number;
  //   salePrice?: number;
  // };
  // inventory?: {
  //   stockQuantity: number;
  //   lowStockThreshold?: number;
  // };
  // images?: string[];
  // isDefault: boolean;
}

// Category
export interface ProductCategory extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  sortOrder?: number;
}

// Cart
export interface Cart extends BaseDocument {
  userId?: string; // If logged in
  sessionId?: string; // If guest
  items: CartItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  expiresAt: Date;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  // Booking-specific
  bookingDate?: Date;
  bookingSlot?: {
    startTime: string;
    endTime: string;
  };
  // Rental-specific
  rentalPeriod?: {
    startDate: Date;
    endDate: Date;
    duration: number;
    periodType: 'hourly' | 'daily' | 'weekly' | 'monthly';
  };
}

// Order
export interface Order extends BaseDocument {
  orderNumber: string; // "ORD-2024-0001"
  customer: {
    userId?: string;
    email: string;
    name: string;
    phone?: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  shippingAddress?: Address;
  billingAddress?: Address;
  payment: {
    method: 'stripe' | 'razorpay' | 'cod' | 'bank_transfer';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: Date;
  };
  fulfillment: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: string;
    carrier?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
  subtotal: number;
  // Type-specific data
  productType: Product['productType'];
  typeData?: {
    bookingDate?: Date;
    bookingSlot?: { startTime: string; endTime: string };
    rentalPeriod?: {
      startDate: Date;
      endDate: Date;
      duration: number;
    };
    downloadUrl?: string; // For digital products
  };
}

export interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}
