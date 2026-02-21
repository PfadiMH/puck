"use server";

import type { Product, ProductInput, ShopSettings } from "@lib/shop/types";
import { requireServerPermission } from "@lib/security/server-guard";
import { dbService } from "./db";

// --- Products ---

export async function getProducts(): Promise<Product[]> {
  await requireServerPermission({ all: ["shop:read"] });
  return dbService.getProducts();
}

/** Public — no auth required. Only returns active products. */
export async function getActiveProducts(): Promise<Product[]> {
  return dbService.getActiveProducts();
}

export async function getProduct(id: string): Promise<Product | null> {
  await requireServerPermission({ all: ["shop:read"] });
  return dbService.getProduct(id);
}

export async function saveProduct(product: ProductInput): Promise<Product> {
  await requireServerPermission({ all: ["shop:update"] });
  return dbService.saveProduct(product);
}

export async function updateProduct(
  id: string,
  product: ProductInput
): Promise<Product | null> {
  await requireServerPermission({ all: ["shop:update"] });
  return dbService.updateProduct(id, product);
}

export async function deleteProduct(id: string): Promise<void> {
  await requireServerPermission({ all: ["shop:update"] });
  return dbService.deleteProduct(id);
}

// --- Shop Settings ---

export async function getShopSettings(): Promise<ShopSettings> {
  await requireServerPermission({ all: ["shop:read"] });
  return dbService.getShopSettings();
}

export async function saveShopSettings(
  settings: ShopSettings
): Promise<void> {
  await requireServerPermission({ all: ["shop:update"] });
  return dbService.saveShopSettings(settings);
}
