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
  saveShopSettings,
} from "@lib/db/shop-actions";
import type { Product, ShopSettings } from "@lib/shop/types";
import { formatPrice } from "@lib/shop/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
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
      toast.success("Produkt gelöscht");
    },
    onError: () => toast.error("Fehler beim Löschen"),
  });

  const settingsMutation = useMutation({
    mutationFn: (s: ShopSettings) => saveShopSettings(s),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-settings"] });
      toast.success("Einstellungen gespeichert");
    },
    onError: () => toast.error("Fehler beim Speichern"),
  });

  function getTotalStock(product: Product) {
    if (product.variants.length === 0) return 0;
    return product.variants.reduce((sum, v) => sum + v.stock, 0);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shop</h1>
          <p className="text-contrast-ground/60 mt-1">
            Produkte und Einstellungen verwalten
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="small"
            color={activeTab === "products" ? "primary" : "secondary"}
            onClick={() => setActiveTab("products")}
          >
            Produkte
          </Button>
          <Button
            size="small"
            color={activeTab === "settings" ? "primary" : "secondary"}
            onClick={() => setActiveTab("settings")}
          >
            Einstellungen
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
                    Produkt hinzufügen
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
              Laden...
            </p>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto text-contrast-ground/30 mb-4" />
              <p className="text-contrast-ground/60">
                Noch keine Produkte vorhanden.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-contrast-ground/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Preis</TableHead>
                    <TableHead>Lager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product._id}
                      id={`product-row-${product._id}`}
                      className={
                        product._id === highlightId
                          ? "animate-pulse bg-primary/10"
                          : undefined
                      }
                    >
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
                          {product.active ? "Aktiv" : "Inaktiv"}
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
                              title="Bearbeiten"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-brand-red/10 text-brand-red transition-colors"
                              onClick={() => setDeletingProduct(product)}
                              title="Löschen"
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
          <DialogTitle>Produkt löschen</DialogTitle>
          <p className="text-contrast-ground/70">
            Möchtest du{" "}
            <span className="font-semibold">
              &ldquo;{deletingProduct?.name}&rdquo;
            </span>{" "}
            wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <DialogActions>
            <DialogClose>
              <Button size="medium">Abbrechen</Button>
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
              {deleteMutation.isPending ? "Löschen..." : "Löschen"}
            </Button>
          </DialogActions>
        </Dialog>
      </DialogRoot>
    </div>
  );
}
