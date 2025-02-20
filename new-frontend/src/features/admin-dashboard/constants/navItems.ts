import { FolderTree, Tags, LayoutDashboard, Users } from "lucide-react";
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
    icon: Tags,
    description: "View your inventory",
  },
  {
    title: "Box lookup",
    href: "/admin/inventory",
    icon: FolderTree,
    description: "Manage inventory items",
  },
  {
    title: "Create boxes",
    href: "/admin/categories",
    icon: Tags,
    description: "Create boxes or add items to existing boxes",
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
    icon: Tags,
    description: "Define and organize sizes",
  },
  {
    title: "Activity Log",
    href: "/admin/activity-log",
    icon: LayoutDashboard,
    description: "View activity log",
  }

];
