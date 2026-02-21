"use client";

import { useCart } from "@components/shop/CartProvider";
import cn from "@lib/cn";
import type { Product } from "@lib/shop/types";
import type { WebshopSize } from "./Webshop";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatPrice(rappen: number) {
  return `CHF ${(rappen / 100).toFixed(2)}`;
}

/** Fixed card pixel widths */
const sizePixels: Record<WebshopSize, number> = {
  gross: 260,
  mittel: 210,
  klein: 160,
};

function ImageCarousel({
  images,
  name,
  size,
}: {
  images: string[];
  name: string;
  size: WebshopSize;
}) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Live pixel offset during any interaction (drag, touch, wheel)
  const offsetRef = useRef(0);
  // Whether we're in an active interaction (no CSS transition)
  const interactingRef = useRef(false);
  // Force re-render for strip transform updates during interactions
  const [, forceRender] = useState(0);
  const kick = useCallback(() => forceRender((n) => n + 1), []);
  // Zoom preview state (declared early so wheel handler can dismiss it)
  const [zoom, setZoom] = useState<{
    bgPos: string;
    panelX: number;
    panelY: number;
  } | null>(null);

  const lastSlide = images.length - 1;

  /** Get container width (= one slide width) */
  const getWidth = useCallback(() => {
    return containerRef.current?.offsetWidth ?? 1;
  }, []);

  /** Max rubber-band stretch in pixels (drag/touch only) */
  const RUBBER_MAX = 60;

  /** Clamp offset at edges. rubberBand=true for drag/touch, false for wheel. */
  const clampOffset = useCallback(
    (rawOffset: number, cur: number, rubberBand: boolean) => {
      const w = getWidth();
      const maxForward = -(lastSlide - cur) * w; // negative = swipe left
      const maxBack = cur * w; // positive = swipe right
      if (rawOffset < maxForward) {
        if (!rubberBand) return maxForward; // hard stop for wheel
        const over = (rawOffset - maxForward) * 0.3;
        return maxForward + Math.max(over, -RUBBER_MAX);
      }
      if (rawOffset > maxBack) {
        if (!rubberBand) return maxBack; // hard stop for wheel
        const over = (rawOffset - maxBack) * 0.3;
        return maxBack + Math.min(over, RUBBER_MAX);
      }
      return rawOffset;
    },
    [lastSlide, getWidth]
  );

  /** Snap to nearest valid slide based on current offset */
  const snap = useCallback(
    (velocity = 0) => {
      const w = getWidth();
      const displacement = -offsetRef.current; // positive displacement = moved right (next)
      // Determine how many slides to move
      let slidesDelta = Math.round(displacement / w);
      // Flick detection: if velocity is strong enough, bias by one slide
      if (Math.abs(velocity) > 0.3) {
        slidesDelta = velocity > 0 ? Math.max(slidesDelta, 1) : Math.min(slidesDelta, -1);
      }
      const target = Math.max(0, Math.min(lastSlide, current + slidesDelta));
      offsetRef.current = 0;
      interactingRef.current = false;
      setCurrent(target);
      kick();
    },
    [current, lastSlide, getWidth, kick]
  );

  // --- Arrow navigation ---
  const goTo = useCallback(
    (idx: number) => {
      offsetRef.current = 0;
      interactingRef.current = false;
      setCurrent(Math.max(0, Math.min(lastSlide, idx)));
      kick();
    },
    [lastSlide, kick]
  );

  // --- Mouse drag ---
  const dragStartX = useRef(0);
  const dragLastX = useRef(0);
  const dragLastTime = useRef(0);
  const dragVelocity = useRef(0);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!hasMultiple) return;
      e.preventDefault();
      dragStartX.current = e.clientX;
      dragLastX.current = e.clientX;
      dragLastTime.current = Date.now();
      dragVelocity.current = 0;
      isDragging.current = true;
      interactingRef.current = true;
      offsetRef.current = 0;
      kick();
    },
    [hasMultiple, kick]
  );

  useEffect(() => {
    if (!hasMultiple) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const now = Date.now();
      const dt = now - dragLastTime.current;
      const dx = e.clientX - dragLastX.current;
      if (dt > 0) {
        dragVelocity.current = dx / dt; // px/ms
      }
      dragLastX.current = e.clientX;
      dragLastTime.current = now;

      const totalDx = e.clientX - dragStartX.current;
      offsetRef.current = clampOffset(totalDx, current, true);
      kick();
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      // Convert velocity from px/ms to slides-ish scale
      const w = getWidth();
      const normalizedVelocity = (dragVelocity.current * 200) / w;
      snap(-normalizedVelocity);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [hasMultiple, current, clampOffset, getWidth, snap, kick]);

  // --- Touch swipe ---
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchLastX = useRef(0);
  const touchLastTime = useRef(0);
  const touchVelocity = useRef(0);
  const touchActive = useRef(false);
  const touchDirectionLocked = useRef<"h" | "v" | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!hasMultiple) return;
      const t = e.touches[0];
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
      touchLastX.current = t.clientX;
      touchLastTime.current = Date.now();
      touchVelocity.current = 0;
      touchActive.current = true;
      touchDirectionLocked.current = null;
      interactingRef.current = true;
      offsetRef.current = 0;
      kick();
    },
    [hasMultiple, kick]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchActive.current || !hasMultiple) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX.current;
      const dy = t.clientY - touchStartY.current;

      // Lock direction on first significant movement
      if (!touchDirectionLocked.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        touchDirectionLocked.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
      }

      // If vertical scroll, bail out
      if (touchDirectionLocked.current === "v") {
        touchActive.current = false;
        interactingRef.current = false;
        offsetRef.current = 0;
        kick();
        return;
      }

      // Horizontal swipe — prevent scroll and track
      e.preventDefault();

      const now = Date.now();
      const dt = now - touchLastTime.current;
      const moveDx = t.clientX - touchLastX.current;
      if (dt > 0) {
        touchVelocity.current = moveDx / dt;
      }
      touchLastX.current = t.clientX;
      touchLastTime.current = now;

      offsetRef.current = clampOffset(dx, current, true);
      kick();
    },
    [hasMultiple, current, clampOffset, kick]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchActive.current) return;
    touchActive.current = false;
    const w = getWidth();
    const normalizedVelocity = (touchVelocity.current * 200) / w;
    snap(-normalizedVelocity);
  }, [getWidth, snap]);

  // --- Trackpad wheel ---
  const wheelTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!hasMultiple) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Only horizontal scroll (trackpad swipe)
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

      // Hard clamp (no rubber-band) — stops dead at edges
      const newOffset = clampOffset(
        offsetRef.current - e.deltaX,
        current,
        false
      );

      // At edge and offset didn't change — let the event pass through,
      // no re-render, no snap reset. Kills the oscillation lag.
      if (newOffset === offsetRef.current) return;

      e.preventDefault();
      interactingRef.current = true;
      offsetRef.current = newOffset;
      setZoom(null);
      kick();

      // Snap after gesture settles
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        snap();
      }, 150);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(wheelTimeout.current);
    };
  }, [hasMultiple, current, clampOffset, snap, kick, setZoom]);

  // --- Zoom preview ---
  const handleZoomMove = useCallback(
    (e: React.MouseEvent) => {
      if (images.length === 0 || isDragging.current || interactingRef.current) {
        setZoom(null);
        return;
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;

      setZoom({
        bgPos: `${xPct}% ${yPct}%`,
        panelX: rect.right + 8,
        panelY: rect.top,
      });
    },
    [images.length]
  );

  const handleMouseLeave = useCallback(() => {
    setZoom(null);
    if (isDragging.current) {
      isDragging.current = false;
      snap();
    }
  }, [snap]);

  // --- Compute strip transform ---
  const translateX = interactingRef.current
    ? `calc(-${current * 100}% + ${offsetRef.current}px)`
    : `${-current * 100}%`;

  const stripStyle: React.CSSProperties = {
    display: "flex",
    transform: `translateX(${translateX})`,
    transition: interactingRef.current ? "none" : "transform 300ms ease-out",
    willChange: "transform",
  };

  const zoomSize = size === "klein" ? 200 : size === "mittel" ? 280 : 350;

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-contrast-ground/5",
          hasMultiple ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair",
          size === "klein" ? "aspect-[4/3]" : "aspect-square"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleZoomMove}
        onMouseLeave={handleMouseLeave}
      >
        {images.length > 0 ? (
          <>
            {/* Sliding strip of all images */}
            <div ref={stripRef} style={stripStyle} className="h-full">
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-cover select-none pointer-events-none shrink-0"
                  draggable={false}
                />
              ))}
            </div>
            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(current - 1);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center transition-opacity",
                    current === 0
                      ? "opacity-0 pointer-events-none"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(current + 1);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center transition-opacity",
                    current === lastSlide
                      ? "opacity-0 pointer-events-none"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        goTo(i);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        i === current ? "bg-white" : "bg-white/50"
                      )}
                      aria-label={`Bild ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-contrast-ground/20" />
          </div>
        )}
      </div>

      {/* Zoom preview — portal-style fixed position so it floats above everything */}
      {zoom && images[current] && (
        <div
          className="fixed z-50 rounded-lg shadow-xl border border-contrast-ground/10 overflow-hidden pointer-events-none hidden md:block"
          style={{
            width: zoomSize,
            height: zoomSize,
            left: zoom.panelX,
            top: zoom.panelY,
            backgroundImage: `url(${images[current]})`,
            backgroundSize: "250%",
            backgroundPosition: zoom.bgPos,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </>
  );
}

function ProductCard({
  product,
  size,
}: {
  product: Product;
  size: WebshopSize;
}) {
  const { addItem, setCartOpen } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [added, setAdded] = useState(false);

  // Initialize default selections
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const opt of product.options) {
      if (opt.values.length > 0) {
        defaults[opt.name] = opt.values[0];
      }
    }
    setSelectedOptions(defaults);
  }, [product.options]);

  function getSelectedVariantIndex(): number {
    if (product.variants.length <= 1) return 0;
    return product.variants.findIndex((v) =>
      Object.entries(selectedOptions).every(
        ([key, val]) => v.options[key] === val
      )
    );
  }

  function getSelectedVariant() {
    const idx = getSelectedVariantIndex();
    return idx >= 0 ? product.variants[idx] : null;
  }

  const variant = getSelectedVariant();
  const variantIndex = getSelectedVariantIndex();
  const currentPrice = variant?.price || product.price;
  const inStock = variant ? variant.stock > 0 : false;

  function handleAdd() {
    if (!variant || variantIndex < 0) return;
    addItem({
      productId: product._id,
      variantIndex,
      quantity: 1,
      name: product.name,
      price: currentPrice,
      selectedOptions: { ...selectedOptions },
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    // Brief delay so the user sees the button feedback before drawer opens
    setTimeout(() => setCartOpen(true), 300);
  }

  return (
    <div
      style={{ width: sizePixels[size], minWidth: sizePixels[size] }}
      className="group rounded-xl overflow-hidden bg-elevated shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image carousel */}
      <ImageCarousel images={product.images} name={product.name} size={size} />

      {/* Content */}
      <div className={cn("p-4", size === "klein" && "p-3")}>
        <h3
          className={cn(
            "font-semibold mb-1 truncate",
            size === "gross" ? "text-lg" : "text-base"
          )}
        >
          {product.name}
        </h3>
        {product.description && size !== "klein" && (
          <p className="text-sm text-contrast-ground/60 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Options */}
        {product.options.map((opt) => (
          <div key={opt.name} className="mb-2">
            <label className="text-xs font-medium text-contrast-ground/70 block mb-1">
              {opt.name}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {opt.values.map((val) => (
                <button
                  key={val}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-full border transition-colors",
                    selectedOptions[opt.name] === val
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-contrast-ground/15 hover:border-contrast-ground/30"
                  )}
                  onClick={() =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [opt.name]: val,
                    }))
                  }
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-contrast-ground/10">
          <span
            className={cn(
              "font-bold",
              size === "gross" ? "text-xl" : "text-lg"
            )}
          >
            {formatPrice(currentPrice)}
          </span>
          <button
            className={cn(
              "rounded-full font-medium transition-all duration-200",
              size === "klein"
                ? "px-2.5 py-1 text-xs"
                : "px-3 py-1.5 text-sm",
              added
                ? "bg-primary/80 text-contrast-primary scale-95"
                : inStock
                  ? "bg-primary text-contrast-primary hover:bg-primary/90 active:scale-95"
                  : "bg-contrast-ground/20 text-contrast-ground/50 cursor-not-allowed"
            )}
            disabled={!inStock || added}
            onClick={handleAdd}
          >
            {added ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {size !== "klein" && "Hinzugefügt!"}
              </span>
            ) : inStock ? (
              size === "klein"
                ? "Kaufen"
                : "In den Warenkorb"
            ) : (
              "Ausverkauft"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function WebshopClient({ size }: { size: WebshopSize }) {
  const { enableCart, disableCart } = useCart();

  // Signal to navbar that this page has a shop
  useEffect(() => {
    enableCart();
    return () => disableCart();
  }, [enableCart, disableCart]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["shop-products"],
    queryFn: async () => {
      const res = await fetch("/api/shop/products");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-contrast-ground/50">
        Produkte werden geladen...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="w-12 h-12 mx-auto text-contrast-ground/20 mb-3" />
        <p className="text-contrast-ground/50">
          Aktuell sind keine Produkte verfügbar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} size={size} />
      ))}
    </div>
  );
}
