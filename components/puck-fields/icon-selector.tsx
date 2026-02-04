"use client";

import cn from "@lib/cn";
import { CustomFieldRenderProps } from "@lib/custom-field-types";
import { CustomField } from "@puckeditor/core";
import {
  Droplets,
  Sun,
  CloudRain,
  Apple,
  Sandwich,
  Flashlight,
  Compass,
  Backpack,
  Footprints,
  Shirt,
  Map,
  Tent,
  Cookie,
  Utensils,
  Thermometer,
  Glasses,
  Watch,
  Smartphone,
  Banknote,
  type LucideIcon,
} from "lucide-react";

type IconSelectorProps = string | undefined;

/**
 * Predefined icons for scout packing lists.
 * These cover common items scouts might need for activities.
 */
export const PACKING_ICONS: { id: string; icon: LucideIcon; label: string }[] = [
  { id: "droplets", icon: Droplets, label: "Trinkflasche" },
  { id: "sun", icon: Sun, label: "Sonnencreme" },
  { id: "cloudrain", icon: CloudRain, label: "Regenjacke" },
  { id: "apple", icon: Apple, label: "Znüni/Zvieri" },
  { id: "sandwich", icon: Sandwich, label: "Lunch" },
  { id: "cookie", icon: Cookie, label: "Snacks" },
  { id: "utensils", icon: Utensils, label: "Besteck" },
  { id: "flashlight", icon: Flashlight, label: "Taschenlampe" },
  { id: "compass", icon: Compass, label: "Kompass" },
  { id: "backpack", icon: Backpack, label: "Rucksack" },
  { id: "footprints", icon: Footprints, label: "Wanderschuhe" },
  { id: "shirt", icon: Shirt, label: "Wechselkleider" },
  { id: "map", icon: Map, label: "Karte" },
  { id: "tent", icon: Tent, label: "Zelt" },
  { id: "thermometer", icon: Thermometer, label: "Warme Kleidung" },
  { id: "glasses", icon: Glasses, label: "Sonnenbrille" },
  { id: "watch", icon: Watch, label: "Uhr" },
  { id: "smartphone", icon: Smartphone, label: "Handy" },
  { id: "banknote", icon: Banknote, label: "Geld" },
];

/**
 * Get the icon component for a given icon ID
 */
export function getPackingIcon(iconId: string | undefined): LucideIcon | null {
  if (!iconId) return null;
  const found = PACKING_ICONS.find((i) => i.id === iconId);
  return found?.icon ?? null;
}

function IconSelector({
  id,
  onChange,
  value,
  readOnly,
}: CustomFieldRenderProps<IconSelectorProps>) {
  const selectedIcon = PACKING_ICONS.find((i) => i.id === value);

  return (
    <div className="flex flex-col gap-2" id={id}>
      {/* Current selection display */}
      {selectedIcon && (
        <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
          <selectedIcon.icon className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">{selectedIcon.label}</span>
          {!readOnly && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="ml-auto text-xs text-red-500 hover:text-red-700"
            >
              Entfernen
            </button>
          )}
        </div>
      )}

      {/* Icon grid */}
      {!readOnly && (
        <div className="grid grid-cols-6 gap-1">
          {PACKING_ICONS.map(({ id: iconId, icon: Icon, label }) => (
            <button
              key={iconId}
              type="button"
              onClick={() => onChange(iconId)}
              title={label}
              className={cn(
                "p-2 rounded-md transition-colors",
                "hover:bg-primary/20",
                "focus:outline-none focus:ring-2 focus:ring-primary/60",
                value === iconId
                  ? "bg-primary/30 ring-2 ring-primary"
                  : "bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 mx-auto text-gray-700" />
            </button>
          ))}
        </div>
      )}

      {/* No icon selected message */}
      {!selectedIcon && !readOnly && (
        <p className="text-xs text-gray-500">
          Klicke auf ein Icon um es auszuwählen (optional)
        </p>
      )}
    </div>
  );
}

export const iconSelectorField: CustomField<IconSelectorProps> = {
  type: "custom",
  label: "Icon",
  render: IconSelector,
};
