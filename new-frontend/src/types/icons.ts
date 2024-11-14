import type { LucideIcon } from "lucide-react";
import {
  Folder,
  FolderTree,
  Shirt,
  Footprints,
  Watch,
  Bath,
  PenLine,
  CircleDot,
  Backpack,
  Cloud,
  Smile,
  Package,
  School,
  Box,
  ShoppingBag,
  Scissors,
  Book,
  Heart,
} from "lucide-react";

// Map of all available icons
export const CATEGORY_ICONS = {
  Folder,
  FolderTree,
  Footprints,
  Shirt,
  Watch,
  Bath,
  PenLine,
  CircleDot,
  Backpack,
  Cloud,
  Smile,
  Package,
  School,
  Box,
  ShoppingBag,
  Scissors,
  Book,
  Heart,
} as const;

export type CategoryIconName = keyof typeof CATEGORY_ICONS;

export interface IconMapping {
  icon: CategoryIconName;
  component: LucideIcon;
}

// Type guard to check if a string is a valid icon name
export function isCategoryIcon(icon: string | null): icon is CategoryIconName {
  return icon != null && Object.keys(CATEGORY_ICONS).includes(icon);
}

// Helper to get icon component
export function getCategoryIcon(iconName: string | null): LucideIcon {
  if (!iconName || !isCategoryIcon(iconName)) {
    return Folder;
  }
  return CATEGORY_ICONS[iconName];
}
