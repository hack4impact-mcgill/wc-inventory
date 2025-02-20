import { FolderTree, Tags, LayoutDashboard, Users, PackagePlus, PackageSearch, Shirt, Ruler, Logs } from "lucide-react";
import { NavItem } from "../types";

export const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview component",
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Shirt,
    description: "View your inventory items",
  },
  {
    title: "Box lookup",
    href: "/admin/box-lookup",
    icon: PackageSearch,
    description: "Search for boxes or items in boxes",
  },
  {
    title: "Create boxes",
    href: "/admin/create-boxes",
    icon: PackagePlus,
    description: "Create boxes or add items to existing boxes",
  },
  {
    title: "Activity Log",
    href: "/admin/activity-log",
    icon: Logs,
    description: "View activity log",
  },
  {
    title: "Manage staff",
    href: "/admin/users",
    icon: Users,
    description: "Manage users and permissions",
  },
  {
    title: "Location Management",
    href: "/admin/locations",
    icon: FolderTree,
    description: "Organize and manage locations",
  },
  {
    title: "Category Management",
    href: "/admin/categories",
    icon: Tags,
    description: "Define and organize categories",
  },
  {
    title: "Size Management",
    href: "/admin/sizes",
    icon: Ruler,
    description: "Define and organize sizes",
  }

];
