"use client";

import type { CartItem } from "@lib/shop/types";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "pfadimh-cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantIndex: number) => void;
  updateQuantity: (
    productId: string,
    variantIndex: number,
    quantity: number
  ) => void;
  updateItemPrice: (
    productId: string,
    variantIndex: number,
    price: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** True when the current page has a Webshop component or the cart has items */
  isCartVisible: boolean;
  /** Called by the Webshop component on mount to signal the cart should show */
  enableCart: () => void;
  disableCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [shopOnPage, setShopOnPage] = useState(false);

  // Hydrate from localStorage with validation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        // Validate it's an array with expected shape
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item): item is CartItem =>
              item != null &&
              typeof item === "object" &&
              typeof item.productId === "string" &&
              typeof item.variantIndex === "number" &&
              typeof item.quantity === "number" &&
              Number.isFinite(item.quantity) &&
              item.quantity > 0 &&
              typeof item.name === "string" &&
              typeof item.price === "number" &&
              Number.isFinite(item.price)
          );
          setItems(valid);
        }
      }
    } catch {
      // Ignore parse errors — start with empty cart
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.variantIndex === item.variantIndex
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId &&
          i.variantIndex === item.variantIndex
            ? { ...i, ...item, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback(
    (productId: string, variantIndex: number) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.productId === productId && i.variantIndex === variantIndex)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantIndex: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantIndex);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantIndex === variantIndex
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const updateItemPrice = useCallback(
    (productId: string, variantIndex: number, price: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantIndex === variantIndex
            ? { ...i, price }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const enableCart = useCallback(() => setShopOnPage(true), []);
  const disableCart = useCallback(() => setShopOnPage(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const isCartVisible = shopOnPage || items.length > 0;

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItemPrice,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setCartOpen,
      isCartVisible,
      enableCart,
      disableCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItemPrice,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setCartOpen,
      isCartVisible,
      enableCart,
      disableCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
