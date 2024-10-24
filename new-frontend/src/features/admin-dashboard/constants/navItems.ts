import { FolderTree, Tags, LayoutDashboard, Users } from 'lucide-react';
import { NavItem } from '../types';

export const navItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Overview component',
    },
    {
        title: "Inventory Management",
        href: '/admin/inventory',
        icon: FolderTree,
        description: 'Manage inventory items',
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
        description: 'Manage users and permissions',
    },
    {
        title: 'Location Management',
        href: '/admin/locations',
        icon: FolderTree,
        description: 'Organize and manage locations',
    },
    {
        title: 'Category Management',
        href: '/admin/categories',
        icon: Tags,
        description: 'Define and organize categories',
    },
];