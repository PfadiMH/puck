import {
  Apple,
  Backpack,
  Banknote,
  CloudRain,
  Compass,
  Cookie,
  Droplets,
  Flashlight,
  Footprints,
  Glasses,
  Map,
  Sandwich,
  Shirt,
  Smartphone,
  Sun,
  Tent,
  Thermometer,
  Utensils,
  Watch,
  type LucideIcon,
} from "lucide-react";

export type PackingIcon = {
  id: string;
  icon: LucideIcon;
  label: string;
};

/**
 * Predefined icons for scout packing lists.
 * Covers common items scouts might need for activities.
 */
export const PACKING_ICONS: PackingIcon[] = [
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
 * Get the icon component for a given icon ID.
 */
export function getPackingIcon(iconId: string | undefined): LucideIcon | null {
  if (!iconId) return null;
  return PACKING_ICONS.find((i) => i.id === iconId)?.icon ?? null;
}
