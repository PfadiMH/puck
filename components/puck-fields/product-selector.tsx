"use client";

import type { Product } from "@lib/shop/types";
import { formatPrice } from "@lib/shop/utils";
import type { CustomField } from "@puckeditor/core";
import { useEffect, useState } from "react";

/**
 * Custom Puck field component that fetches products and renders a
 * multi-select checkbox list. Used inside the Puck editor sidebar
 * for the Webshop component to choose which products to display.
 */
function ProductSelector({
  value,
  onChange,
}: {
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/shop/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        setError(true);
        setLoaded(true);
      });
  }, []);

  const selected = value ?? [];

  function handleToggle(productId: string) {
    const next = selected.includes(productId)
      ? selected.filter((id) => id !== productId)
      : [...selected, productId];
    onChange(next.length > 0 ? next : undefined);
  }

  if (error) {
    return (
      <div
        style={{
          padding: "8px",
          color: "#b91c1c",
          fontSize: "13px",
        }}
      >
        Fehler beim Laden der Produkte.
      </div>
    );
  }

  if (!loaded) {
    return (
      <div style={{ padding: "8px", fontSize: "13px", color: "#6b7280" }}>
        Laden...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: "8px", fontSize: "13px", color: "#6b7280" }}>
        Keine Produkte vorhanden.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div
        style={{
          fontSize: "12px",
          color: "#6b7280",
          marginBottom: "4px",
        }}
      >
        {selected.length === 0
          ? "Alle Produkte werden angezeigt"
          : `${selected.length} Produkt${selected.length === 1 ? "" : "e"} ausgewählt`}
      </div>
      {products.map((product) => (
        <label
          key={product._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
            fontSize: "13px",
            backgroundColor: selected.includes(product._id)
              ? "#f0f9ff"
              : "transparent",
          }}
        >
          <input
            type="checkbox"
            checked={selected.includes(product._id)}
            onChange={() => handleToggle(product._id)}
            style={{ margin: 0 }}
          />
          <span>
            {product.name} ({formatPrice(product.price)})
          </span>
        </label>
      ))}
    </div>
  );
}

export const productSelectorField: CustomField<string[] | undefined> = {
  type: "custom",
  label: "Produkte auswählen",
  render: ProductSelector,
};
