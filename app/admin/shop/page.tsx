import { ShopAdmin } from "@components/shop/ShopAdmin";
import { requireServerPermission } from "@lib/security/server-guard";

export default async function AdminShopPage() {
  await requireServerPermission({ all: ["shop:read"] });

  return (
    <main className="max-w-6xl mx-auto p-6">
      <ShopAdmin />
    </main>
  );
}
