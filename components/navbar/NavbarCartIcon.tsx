"use client";

import { useCart } from "@components/shop/CartProvider";
import { ShoppingCart } from "lucide-react";

export function NavbarCartIcon({ compact }: { compact?: boolean }) {
  const { isCartVisible, isHydrated, totalItems, setCartOpen } = useCart();

  if (isHydrated && !isCartVisible) return null;

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative flex items-center justify-center w-10 h-10 text-black rounded-full border border-black/80 hover:border-black transition-colors"
      aria-label={`Cart (${totalItems} items)`}
    >
      <ShoppingCart className={compact ? "w-4 h-4" : "w-[18px] h-[18px]"} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-contrast-primary text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
