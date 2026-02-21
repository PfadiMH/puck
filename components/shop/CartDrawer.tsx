"use client";

import Button from "@components/ui/Button";
import cn from "@lib/cn";
import type { Product } from "@lib/shop/types";
import {
  AlertTriangle,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";

function formatPrice(rappen: number) {
  return `CHF ${(rappen / 100).toFixed(2)}`;
}

/** Cart item with validation info overlaid */
interface CartItemStatus {
  unavailable?: boolean; // product deleted/deactivated
  outOfStock?: boolean; // variant stock = 0
  lowStock?: number; // stock < requested quantity
  priceChanged?: number; // new price if different
}

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateItemPrice,
    totalItems,
    totalPrice,
    isCartOpen,
    setCartOpen,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [itemStatuses, setItemStatuses] = useState<
    Record<string, CartItemStatus>
  >({});
  const [validating, setValidating] = useState(false);
  const lastValidated = useRef(0);

  // Validate cart against live product data when drawer opens
  const validateCart = useCallback(async () => {
    if (items.length === 0) return;

    // Don't re-validate within 5 seconds
    if (Date.now() - lastValidated.current < 5000) return;

    setValidating(true);
    try {
      const res = await fetch("/api/shop/products");
      if (!res.ok) return;
      const products: Product[] = await res.json();

      const statuses: Record<string, CartItemStatus> = {};
      for (const item of items) {
        const key = `${item.productId}-${item.variantIndex}`;
        const product = products.find((p) => p._id === item.productId);

        if (!product) {
          statuses[key] = { unavailable: true };
          continue;
        }

        const variant = product.variants[item.variantIndex];
        if (!variant) {
          statuses[key] = { unavailable: true };
          continue;
        }

        const status: CartItemStatus = {};
        const currentPrice = variant.price || product.price;

        if (currentPrice !== item.price) {
          status.priceChanged = currentPrice;
          updateItemPrice(item.productId, item.variantIndex, currentPrice);
        }

        if (variant.stock === 0) {
          status.outOfStock = true;
        } else if (variant.stock < item.quantity) {
          status.lowStock = variant.stock;
        }

        if (Object.keys(status).length > 0) {
          statuses[key] = status;
        }
      }

      setItemStatuses(statuses);
      lastValidated.current = Date.now();
    } catch {
      // Silently fail — validation is best-effort
    } finally {
      setValidating(false);
    }
  }, [items, updateItemPrice]);

  useEffect(() => {
    if (isCartOpen) {
      validateCart();
    }
  }, [isCartOpen, validateCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Close on escape
  useEffect(() => {
    if (!isCartOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isCartOpen, setCartOpen]);

  const hasIssues = Object.values(itemStatuses).some(
    (s) => s.unavailable || s.outOfStock
  );

  async function handleCheckout() {
    if (isCheckingOut || hasIssues) return;
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        const { toast } = await import("sonner");
        toast.error(data.error || "Fehler beim Erstellen der Bestellung");
        setIsCheckingOut(false);
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error("Netzwerkfehler");
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-elevated z-[61] shadow-2xl",
          "flex flex-col transition-transform duration-300 ease-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-contrast-ground/10">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Warenkorb ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-contrast-ground/10 transition-colors"
            aria-label="Warenkorb schliessen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-contrast-ground/40">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Dein Warenkorb ist leer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {validating && (
                <div className="flex items-center gap-2 text-xs text-contrast-ground/50 pb-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Preise werden geprüft...
                </div>
              )}
              {items.map((item) => {
                const key = `${item.productId}-${item.variantIndex}`;
                const status = itemStatuses[key];
                const isUnavailable =
                  status?.unavailable || status?.outOfStock;

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex gap-3 py-3 border-b border-contrast-ground/5 last:border-0",
                      isUnavailable && "opacity-50"
                    )}
                  >
                    {/* Image */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-contrast-ground/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-contrast-ground/30" />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.name}
                      </p>
                      {Object.keys(item.selectedOptions).length > 0 && (
                        <p className="text-xs text-contrast-ground/50 mt-0.5">
                          {Object.values(item.selectedOptions).join(" / ")}
                        </p>
                      )}
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Validation warnings */}
                      {status?.unavailable && (
                        <p className="text-xs text-brand-red mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Nicht mehr verfügbar
                        </p>
                      )}
                      {status?.outOfStock && !status?.unavailable && (
                        <p className="text-xs text-brand-red mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Ausverkauft
                        </p>
                      )}
                      {status?.lowStock && (
                        <p className="text-xs text-brand-red/80 mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Nur noch {status.lowStock} verfügbar
                        </p>
                      )}

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-7 h-7 rounded-full border border-contrast-ground/20 flex items-center justify-center hover:bg-contrast-ground/5 transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantIndex,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 rounded-full border border-contrast-ground/20 flex items-center justify-center hover:bg-contrast-ground/5 transition-colors"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantIndex,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="ml-auto p-1.5 text-brand-red/70 hover:text-brand-red hover:bg-brand-red/10 rounded transition-colors"
                          onClick={() =>
                            removeItem(item.productId, item.variantIndex)
                          }
                          title="Entfernen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-contrast-ground/10 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">Total</span>
              <span className="text-xl font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>
            {hasIssues && (
              <p className="text-xs text-brand-red flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Bitte entferne nicht verfügbare Artikel, um fortzufahren.
              </p>
            )}
            <Button
              color="primary"
              size="large"
              className="w-full"
              disabled={isCheckingOut || hasIssues}
              onClick={handleCheckout}
            >
              {isCheckingOut ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Wird geladen...
                </span>
              ) : (
                "Zur Kasse"
              )}
            </Button>
            <button
              className="w-full text-sm text-contrast-ground/60 hover:text-contrast-ground transition-colors text-center py-1"
              onClick={() => setCartOpen(false)}
            >
              Weiter einkaufen
            </button>
          </div>
        )}
      </div>
    </>
  );
}
