export interface ProductOption {
  name: string; // e.g. "Grösse", "Farbe"
  values: string[]; // e.g. ["S", "M", "L", "XL"]
}

export interface ProductVariant {
  options: Record<string, string>; // e.g. {"Grösse": "M", "Farbe": "Blau"}
  price: number; // price in Rappen (CHF cents)
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[]; // S3 URLs
  price: number; // base price in Rappen (CHF cents)
  options: ProductOption[];
  variants: ProductVariant[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Database representation of a product.
 * Identical to Product — both use string _id (MongoDB ObjectIds are serialized).
 * Kept as a separate type alias for clarity at the DB layer boundary.
 */
export type ProductDb = Product;

export interface ProductInput {
  name: string;
  description: string;
  images: string[];
  price: number;
  options: ProductOption[];
  variants: ProductVariant[];
  active: boolean;
}

export interface ShopSettings {
  fulfillmentEmail: string;
}

export const defaultShopSettings: ShopSettings = {
  fulfillmentEmail: "",
};

export interface CartItem {
  productId: string;
  variantIndex: number;
  quantity: number;
  // denormalized for display
  name: string;
  price: number;
  selectedOptions: Record<string, string>;
  image?: string;
}
