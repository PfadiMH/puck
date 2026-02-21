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
import type {
  Product,
  ProductInput,
  ProductOption,
  ProductVariant,
} from "@lib/shop/types";
import { ArrowLeft, ArrowRight, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ProductEditorProps = {
  product: Product | null;
  onClose: () => void;
  onSaved: (savedId?: string) => void;
};

function generateVariants(
  options: ProductOption[],
  existingVariants: ProductVariant[],
  basePrice: number
): ProductVariant[] {
  if (options.length === 0) {
    // Single variant with no options
    const existing = existingVariants[0];
    return [
      {
        options: {},
        price: existing?.price ?? basePrice,
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
      price: existing?.price ?? basePrice,
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
    product?.variants ?? [{ options: {}, price: 0, stock: 0 }]
  );
  const [active, setActive] = useState(product?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);
  // Raw string state for variant prices (avoids reformatting on every keystroke)
  const [variantPriceStrings, setVariantPriceStrings] = useState<
    Record<number, string>
  >(() => {
    const initial: Record<number, string> = {};
    const v = product?.variants ?? [{ options: {}, price: 0, stock: 0 }];
    v.forEach((variant, idx) => {
      initial[idx] = (variant.price / 100).toFixed(2);
    });
    return initial;
  });

  const basePrice = Math.round(parseFloat(price || "0") * 100);

  // Regenerate variants when options change
  const regenerateVariants = useCallback(() => {
    setVariants((prev) => {
      const newVariants = generateVariants(options, prev, basePrice);
      // Sync variant price strings for new/changed variants
      setVariantPriceStrings((prevStrings) => {
        const next: Record<number, string> = {};
        newVariants.forEach((v, idx) => {
          next[idx] = prevStrings[idx] ?? (v.price / 100).toFixed(2);
        });
        return next;
      });
      return newVariants;
    });
  }, [options, basePrice]);

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

  function updateVariantPrice(index: number, priceStr: string) {
    setVariantPriceStrings((prev) => ({ ...prev, [index]: priceStr }));
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      price: Math.round(parseFloat(priceStr || "0") * 100),
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
      toast.error("Name ist erforderlich");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      toast.error("Preis muss grösser als 0 sein");
      return;
    }

    // Validate options
    const seenNames = new Set<string>();
    for (const opt of options) {
      if (!opt.name.trim()) {
        toast.error("Alle Optionen brauchen einen Namen");
        return;
      }
      const normalizedName = opt.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        toast.error("Optionsnamen müssen eindeutig sein");
        return;
      }
      seenNames.add(normalizedName);
      if (opt.values.some((v) => !v.trim())) {
        toast.error("Alle Optionswerte müssen ausgefüllt sein");
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
          ...v,
          price: v.price || basePrice,
        })),
        active,
      };

      if (isEditing && product) {
        await updateProduct(product._id, input);
        toast.success("Produkt aktualisiert");
        onSaved(product._id);
      } else {
        const created = await saveProduct(input);
        toast.success("Produkt erstellt");
        onSaved(created._id);
      }
    } catch {
      toast.error("Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog className="max-w-[700px] max-h-[85vh] overflow-y-auto">
      <DialogTitle>
        {isEditing ? "Produkt bearbeiten" : "Neues Produkt"}
      </DialogTitle>

      <div className="space-y-5 mt-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Produktname"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Beschreibung
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Produktbeschreibung..."
            rows={3}
            className="w-full bg-mud-secondary text-mud-contrast-secondary border-2 border-primary rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/60 placeholder:opacity-70"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-1">Bilder</label>
          <div className="flex flex-wrap gap-2">
            {images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt=""
                  className="w-20 h-20 rounded object-cover border border-contrast-ground/10"
                />
                <button
                  className="absolute -top-1.5 -right-1.5 bg-brand-red text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                >
                  <X className="w-3 h-3" />
                </button>
                {/* Reorder controls */}
                {images.length > 1 && (
                  <div className="absolute bottom-0 inset-x-0 flex justify-center gap-0.5 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button
                        className="w-5 h-5 rounded bg-black/50 text-white flex items-center justify-center"
                        onClick={() => {
                          const next = [...images];
                          [next[i - 1], next[i]] = [next[i], next[i - 1]];
                          setImages(next);
                        }}
                        title="Nach links"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {i < images.length - 1 && (
                      <button
                        className="w-5 h-5 rounded bg-black/50 text-white flex items-center justify-center"
                        onClick={() => {
                          const next = [...images];
                          [next[i], next[i + 1]] = [next[i + 1], next[i]];
                          setImages(next);
                        }}
                        title="Nach rechts"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
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
          />
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Basispreis (CHF)
          </label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
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
            Aktiv (im Shop sichtbar)
          </label>
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">
              Optionen (z.B. Grösse, Farbe)
            </label>
            <button
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={addOption}
            >
              <Plus className="w-3.5 h-3.5" /> Option hinzufügen
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
                  placeholder="Optionsname (z.B. Grösse)"
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
                      placeholder="Wert"
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
                  + Wert
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Variants */}
        {variants.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Varianten ({variants.length})
            </label>
            <div className="border border-contrast-ground/10 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-contrast-ground/5">
                    <th className="text-left px-3 py-2 font-medium">
                      Variante
                    </th>
                    <th className="text-left px-3 py-2 font-medium w-28">
                      Preis (CHF)
                    </th>
                    <th className="text-left px-3 py-2 font-medium w-24">
                      Lager
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, idx) => (
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
                          value={variantPriceStrings[idx] ?? (variant.price / 100).toFixed(2)}
                          onChange={(e) =>
                            updateVariantPrice(idx, e.target.value)
                          }
                          className="w-full bg-transparent border border-contrast-ground/15 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariantStock(
                              idx,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full bg-transparent border border-contrast-ground/15 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DialogActions>
        <DialogClose>
          <Button size="medium" onClick={onClose}>
            Abbrechen
          </Button>
        </DialogClose>
        <Button
          color="primary"
          size="medium"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Speichern..."
            : isEditing
              ? "Aktualisieren"
              : "Erstellen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
