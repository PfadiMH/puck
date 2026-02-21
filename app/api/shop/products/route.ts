import { getActiveProducts } from "@lib/db/shop-actions";
import { NextResponse } from "next/server";

// GET /api/shop/products — Public, returns active products only
export async function GET() {
  try {
    const products = await getActiveProducts();
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
