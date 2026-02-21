import { getActiveProducts } from "@lib/db/shop-actions";
import { NextResponse } from "next/server";

// GET /api/shop/products — Public, returns active products only
export async function GET() {
  try {
    const products = await getActiveProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
