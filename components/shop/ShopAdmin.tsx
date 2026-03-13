"use client";

import { PermissionGuard } from "@components/security/PermissionGuard";
import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/Dialog";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/Table";
import {
  deleteProduct,
  getProducts,
  getShopSettings,
  reorderProducts,
  saveShopSettings,
} from "@lib/db/shop-actions";
import type { Product, ShopSettings } from "@lib/shop/types";
import { formatPrice } from "@lib/shop/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Package, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ProductEditor } from "./ProductEditor";
import { ShopSettingsForm } from "./ShopSettings";

export function ShopAdmin() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "settings">(
    "products"
  );
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => getProducts(),
  });

  // Scroll to and briefly highlight a product row after save
  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(`product-row-${highlightId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const timer = setTimeout(() => setHighlightId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, products]);

  const { data: settings } = useQuery({
    queryKey: ["shop-settings"],
    queryFn: () => getShopSettings(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDeletingProduct(null);
      toast.success("Product deleted");
    },
    onError: () => toast.error("Error deleting product"),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds: string[]) => reorderProducts(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: () => toast.error("Error reordering products"),
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      const newProducts = [...products];
      const [dragged] = newProducts.splice(draggedIndex, 1);
      newProducts.splice(dropTargetIndex, 0, dragged);
      const orderedIds = newProducts.map((p) => p._id);
      reorderMutation.mutate(orderedIds);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
    dragCounter.current = 0;
  }, [draggedIndex, dropTargetIndex, products, reorderMutation]);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && index !== draggedIndex) {
      setDropTargetIndex(index);
    }
  };

  const handleDragEnter = (index: number) => {
    dragCounter.current++;
    if (draggedIndex !== null && index !== draggedIndex) {
      setDropTargetIndex(index);
    }
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropTargetIndex(null);
    }
  };

  const settingsMutation = useMutation({
    mutationFn: (s: ShopSettings) => saveShopSettings(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-settings"] });
      toast.success("Settings saved");
    },
    onError: () => toast.error("Error saving settings"),
  });

  function getTotalStock(product: Product) {
    if (product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-contrast-ground/70 hover:text-contrast-ground flex items-center gap-1 mb-4">
        ← Back to Overview
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shop</h1>
          <p className="text-contrast-ground/60 mt-1">
            Manage products and settings
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            color={activeTab === "products" ? "primary" : "secondary"}
            onClick={() => setActiveTab("products")}
          >
            Products
          </Button>
          <Button
            size="small"
            color={activeTab === "settings" ? "primary" : "secondary"}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </Button>
        </div>
      </div>

      {activeTab === "settings" && (
        <ShopSettingsForm
          settings={settings ?? { fulfillmentEmail: "" }}
          onSave={(s) => settingsMutation.mutate(s)}
          isSaving={settingsMutation.isPending}
        />
      )}

      {activeTab === "products" && (
        <div>
          <div className="flex justify-end mb-4">
            <PermissionGuard policy={{ all: ["shop:update"] }}>
              <DialogRoot
                open={isCreating || !!editingProduct}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }
                }}
              >
                <DialogTrigger>
                  <Button
                    color="primary"
                    onClick={() => setIsCreating(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>

                <ProductEditor
                  key={editingProduct?._id ?? "new"}
                  product={editingProduct}
                  onClose={() => {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }}
                  onSaved={(savedId?: string) => {
                    queryClient.invalidateQueries({
                      queryKey: ["admin-products"],
                    });
                    setIsCreating(false);
                    setEditingProduct(null);
                    if (savedId) setHighlightId(savedId);
                  }}
                />
              </DialogRoot>
            </PermissionGuard>
          </div>

          {isLoading ? (
            <p className="text-contrast-ground/60 text-center py-12">
              Loading...
            </p>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto text-contrast-ground/30 mb-4" />
              <p className="text-contrast-ground/60">
                No products yet.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-contrast-ground/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow
                      key={product._id}
                      id={`product-row-${product._id}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragLeave={handleDragLeave}
                      className={`${
                        product._id === highlightId
                          ? "animate-pulse bg-primary/10"
                          : ""
                      } ${
                        draggedIndex === index ? "opacity-50" : ""
                      } ${
                        dropTargetIndex === index
                          ? "ring-2 ring-primary ring-inset"
                          : ""
                      }`}
                    >
                      <TableCell className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-contrast-ground/40" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-contrast-ground/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-contrast-ground/30" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            {product.options.length > 0 && (
                              <p className="text-xs text-contrast-ground/50">
                                {product.options
                                  .map((o) => o.name)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            getTotalStock(product) === 0
                              ? "text-brand-red"
                              : ""
                          }
                        >
                          {getTotalStock(product)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.active
                              ? "bg-primary/15 text-primary"
                              : "bg-contrast-ground/10 text-contrast-ground/60"
                          }`}
                        >
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <PermissionGuard
                            policy={{ all: ["shop:update"] }}
                          >
                            <button
                              className="p-1.5 rounded hover:bg-contrast-ground/10 transition-colors"
                              onClick={() => setEditingProduct(product)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-brand-red/10 text-brand-red transition-colors"
                              onClick={() => setDeletingProduct(product)}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <DialogRoot
        open={!!deletingProduct}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
      >
        <Dialog>
          <DialogTitle>Delete Product</DialogTitle>
          <p className="text-contrast-ground/70">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              &ldquo;{deletingProduct?.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </p>
          <DialogActions>
            <DialogClose>
              <Button size="medium">Cancel</Button>
            </DialogClose>
            <Button
              size="medium"
              color="primary"
              className="!bg-brand-red hover:!bg-brand-red/90 active:!bg-brand-red/80"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (deletingProduct) {
                  deleteMutation.mutate(deletingProduct._id);
                }
              }}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
