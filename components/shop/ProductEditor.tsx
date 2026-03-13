"use client";

import { FilePickerModal } from "@components/file-manager/FilePickerModal";
import Button from "@components/ui/Button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogTitle,
} from "@components/ui/Dialog";
import Input from "@components/ui/Input";
import { saveProduct, updateProduct } from "@lib/db/shop-actions";
import { formatPrice } from "@lib/shop/utils";
import type {
  Product,
  ProductInput,
  ProductOption,
  ProductVariant,
} from "@lib/shop/types";
import { GripVertical, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type ProductEditorProps = {
  product: Product | null;
  onClose: () => void;
  onSaved: (savedId?: string) => void;
};

function generateVariants(
  options: ProductOption[],
  existingVariants: ProductVariant[],
): ProductVariant[] {
  if (options.length === 0) {
    // Single variant with no options
    const existing = existingVariants[0];
    return [
      {
        options: {},
        priceAdjustment: existing?.priceAdjustment ?? 0,
        stock: existing?.stock ?? 0,
      },
    ];
  }

  // Cartesian product of all option values
  const combinations: Record<string, string>[] = [{}];
  for (const option of options) {
    const newCombinations: Record<string, string>[] = [];
    for (const combo of combinations) {
      for (const value of option.values) {
        newCombinations.push({ ...combo, [option.name]: value });
      }
    }
    combinations.length = 0;
    combinations.push(...newCombinations);
  }

  return combinations.map((combo) => {
    // Try to find existing variant with same options
    const existing = existingVariants.find((v) =>
      Object.entries(combo).every(([k, val]) => v.options[k] === val)
    );
    return {
      options: combo,
      priceAdjustment: existing?.priceAdjustment ?? 0,
      stock: existing?.stock ?? 0,
    };
  });
}

export function ProductEditor({
  product,
  onClose,
  onSaved,
}: ProductEditorProps) {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [price, setPrice] = useState(
    product ? (product.price / 100).toFixed(2) : ""
  );
  const [options, setOptions] = useState<ProductOption[]>(
    product?.options ?? []
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants ?? [{ options: {}, priceAdjustment: 0, stock: 0 }]
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragEnd = () => {
    if (draggedImageIndex !== null && dropTargetIndex !== null && draggedImageIndex !== dropTargetIndex) {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(draggedImageIndex, 1);
      newImages.splice(dropTargetIndex, 0, draggedImage);
      setImages(newImages);
    }
    setDraggedImageIndex(null);
    setDropTargetIndex(null);
    dragCounter.current = 0;
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex !== null && index !== draggedImageIndex) {
      setDropTargetIndex(index);
    }
  };

  const handleImageDragEnter = (index: number) => {
    dragCounter.current++;
    if (draggedImageIndex !== null && index !== draggedImageIndex) {
      setDropTargetIndex(index);
    }
  };

  const handleImageDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDropTargetIndex(null);
    }
  };

  // Raw string state for variant adjustment values (avoids reformatting on every keystroke)
  const [variantAdjustmentStrings, setVariantAdjustmentStrings] = useState<
    Record<number, string>
  >(() => {
    const initial: Record<number, string> = {};
    const v = product?.variants ?? [{ options: {}, priceAdjustment: 0, stock: 0 }];
    v.forEach((variant, idx) => {
      initial[idx] = (variant.priceAdjustment / 100).toFixed(2);
    });
    return initial;
  });

  const basePrice = Math.round(parseFloat(price || "0") * 100);

  // Regenerate variants when options change
  const regenerateVariants = useCallback(() => {
    setVariants((prev) => {
      const newVariants = generateVariants(options, prev);
      // Sync variant adjustment strings for new/changed variants
      setVariantAdjustmentStrings((prevStrings: Record<number, string>) => {
        const next: Record<number, string> = {};
        newVariants.forEach((v, idx) => {
          next[idx] = prevStrings[idx] ?? (v.priceAdjustment / 100).toFixed(2);
        });
        return next;
      });
      return newVariants;
    });
  }, [options]);

  useEffect(() => {
    regenerateVariants();
    // Only regenerate when options structure changes, not on every price change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  function addOption() {
    setOptions([...options, { name: "", values: [""] }]);
  }

  function removeOption(index: number) {
    setOptions(options.filter((_, i) => i !== index));
  }

  function updateOptionName(index: number, name: string) {
    const updated = [...options];
    updated[index] = { ...updated[index], name };
    setOptions(updated);
  }

  function updateOptionValues(index: number, values: string[]) {
    const updated = [...options];
    updated[index] = { ...updated[index], values };
    setOptions(updated);
  }

  function updateVariantAdjustment(index: number, adjustmentStr: string) {
    setVariantAdjustmentStrings((prev: Record<number, string>) => ({ ...prev, [index]: adjustmentStr }));
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      priceAdjustment: Math.round(parseFloat(adjustmentStr || "0") * 100),
    };
    setVariants(updated);
  }

  function updateVariantStock(index: number, stock: number) {
    const updated = [...variants];
    updated[index] = { ...updated[index], stock };
    setVariants(updated);
  }

  function formatVariantLabel(variant: ProductVariant): string {
    const entries = Object.entries(variant.options);
    if (entries.length === 0) return "Standard";
    return entries.map(([, v]) => v).join(" / ");
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    // Validate options
    const seenNames = new Set<string>();
    for (const opt of options) {
      if (!opt.name.trim()) {
        toast.error("All options need a name");
        return;
      }
      const normalizedName = opt.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        toast.error("Option names must be unique");
        return;
      }
      seenNames.add(normalizedName);
      if (opt.values.some((v) => !v.trim())) {
        toast.error("All option values must be filled in");
        return;
      }
    }

    setSaving(true);
    try {
      const input: ProductInput = {
        name: name.trim(),
        description: description.trim(),
        images,
        price: basePrice,
        options: options.filter((o) => o.name.trim() && o.values.length > 0),
        variants: variants.map((v) => ({
          options: v.options,
          priceAdjustment: v.priceAdjustment ?? 0,
          stock: v.stock,
        })),
        active,
      };

      if (isEditing && product) {
        await updateProduct(product._id, input);
        toast.success("Product updated");
        onSaved(product._id);
      } else {
        const created = await saveProduct(input);
        toast.success("Product created");
        onSaved(created._id);
      }
    } catch {
      toast.error("Error saving product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[700px] max-h-[85vh] overflow-y-auto">
      <DialogTitle>
        {isEditing ? "Edit Product" : "New Product"}
      </DialogTitle>

      <div className="space-y-5 mt-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description..."
            rows={3}
            className="w-full bg-mud-secondary text-mud-contrast-secondary border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          {images.length > 1 && (
            <p className="text-xs text-contrast-ground/50 mb-2">
              Drag to reorder. First image is the main product image.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className={`relative group ${
                  draggedImageIndex === i ? "opacity-50" : ""
                } ${
                  dropTargetIndex === i
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
                draggable
                onDragStart={() => handleImageDragStart(i)}
                onDragEnd={handleImageDragEnd}
                onDragOver={(e) => handleImageDragOver(e, i)}
                onDragEnter={() => handleImageDragEnter(i)}
                onDragLeave={handleImageDragLeave}
              >
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 rounded object-cover border border-contrast-ground/10 cursor-grab active:cursor-grabbing"
                />
                <button
                  className="absolute -top-1.5 -right-1.5 bg-brand-red text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                >
                  <X className="w-3 h-3" />
                </button>
                {images.length > 1 && (
                  <div className="absolute bottom-0 inset-x-0 flex justify-center pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-5 h-5 rounded bg-black/50 text-white flex items-center justify-center">
                      <GripVertical className="w-3 h-3" />
                    </div>
                  </div>
                )}
                {i === 0 && images.length > 1 && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-[10px] px-1 rounded-br">
                    Main
                  </div>
                )}
              </div>
            ))}
            <button
              className="w-20 h-20 rounded border-2 border-dashed border-contrast-ground/20 flex items-center justify-center hover:border-primary/50 transition-colors"
              onClick={() => setShowFilePicker(true)}
            >
              <ImagePlus className="w-5 h-5 text-contrast-ground/40" />
            </button>
          </div>
          <FilePickerModal
            isOpen={showFilePicker}
            onSelect={(result) => {
              const urls = Array.isArray(result) ? result : [result];
              setImages([...images, ...urls]);
              setShowFilePicker(false);
            }}
            onClose={() => setShowFilePicker(false)}
            multiple
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price (CHF)
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
          <p className="text-xs text-contrast-ground/50 mt-1">
            Base price of the product. Variants are calculated as adjustments (+/-) from this.
          </p>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            id="product-active"
            className="rounded"
          />
          <label htmlFor="product-active" className="text-sm">
            Active (visible in shop)
          </label>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Options (e.g. Size, Color)
            </label>
            <button
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={addOption}
            >
              <Plus className="w-3.5 h-3.5" /> Add option
            </button>
          </div>
          {options.map((option, optIdx) => (
            <div
              key={optIdx}
              className="border border-contrast-ground/10 rounded-lg p-3 mb-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <Input
                  size="small"
                  value={option.name}
                  onChange={(e) => updateOptionName(optIdx, e.target.value)}
                  placeholder="Option name (e.g. Size)"
                  className="flex-1"
                />
                <button
                  className="p-1 text-brand-red hover:bg-brand-red/10 rounded"
                  onClick={() => removeOption(optIdx)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {option.values.map((val, valIdx) => (
                  <div key={valIdx} className="flex items-center gap-1">
                    <Input
                      size="small"
                      value={val}
                      onChange={(e) => {
                        const newValues = [...option.values];
                        newValues[valIdx] = e.target.value;
                        updateOptionValues(optIdx, newValues);
                      }}
                      placeholder="Value"
                      className="w-20"
                    />
                    {option.values.length > 1 && (
                      <button
                        className="text-brand-red/70 hover:text-brand-red"
                        onClick={() => {
                          updateOptionValues(
                            optIdx,
                            option.values.filter((_, i) => i !== valIdx)
                          );
                        }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="text-xs text-primary hover:underline px-2 py-1"
                  onClick={() =>
                    updateOptionValues(optIdx, [...option.values, ""])
                  }
                >
                  + Value
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Variants */}
        {variants.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Variants ({variants.length})
            </label>
            <p className="text-xs text-contrast-ground/50 mb-2">
              Price adjustment relative to base price. 0 = base price, positive = surcharge, negative = discount.
            </p>
            <div className="border border-contrast-ground/10 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-contrast-ground/5">
                    <th className="text-left px-3 py-2 font-medium">
                      Variant
                    </th>
                    <th className="text-left px-3 py-2 font-medium w-28">
                      +/- (CHF)
                    </th>
                    <th className="text-left px-3 py-2 font-medium w-24">
                      Effective
                    </th>
                    <th className="text-left px-3 py-2 font-medium w-24">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => {
                    const effectivePrice = basePrice + (variant.priceAdjustment ?? 0);
                    return (
                      <tr
                        key={idx}
                        className="border-t border-contrast-ground/5"
                      >
                        <td className="px-3 py-2">
                          {formatVariantLabel(variant)}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.05"
                            value={variantAdjustmentStrings[idx] ?? (variant.priceAdjustment / 100).toFixed(2)}
                            onChange={(e) =>
                              updateVariantAdjustment(idx, e.target.value)
                            }
                            className="w-full bg-transparent border border-contrast-ground/15 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60"
                          />
                        </td>
                        <td className="px-3 py-2 text-xs text-contrast-ground/60">
                          {formatPrice(effectivePrice)}
                        </td>
                        <td className="px-3 py-2">
                           <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10);
                              updateVariantStock(
                                idx,
                                Number.isNaN(parsed) ? 0 : Math.max(0, parsed)
                              );
                            }}
                            className="w-full bg-transparent border border-contrast-ground/15 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DialogActions>
        <DialogClose>
          <Button size="medium" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          color="primary"
          size="medium"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update"
              : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
