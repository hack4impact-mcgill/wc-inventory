import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Users, FolderTree, Tags, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const navItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/admin',
        icon: LayoutDashboard,
        description: 'Overview component',
    },
    // {
    //     title: 'User Management',
    //     href: '/admin/users',
    //     icon: Users,
    //     description: 'Manage users and permissions',
    // },
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

const AdminDashboard: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getCurrentPageTitle = () => {
        const currentItem = navItems.find(item => item.href === location.pathname);
        return currentItem?.title || 'Admin Dashboard';
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <aside className="fixed inset-y-0 z-50 flex w-72 flex-col">
                <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                        <span className="text-lg font-semibold dark:text-white">
                            Admin Portal
                        </span>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                const ItemIcon = item.icon;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            to={item.href}
                                            className={cn(
                                                "flex items-center gap-x-3 rounded-lg px-3 py-2 transition-colors",
                                                "hover:bg-gray-100 dark:hover:bg-gray-700",
                                                isActive && "bg-gray-100 dark:bg-gray-700"
                                            )}
                                        >
                                            <ItemIcon className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                            )} />
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
                                                )}>
                                                    {item.title}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:inline-block">
                                                    {item.description}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            <main className="pl-72 w-full">
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center gap-x-4">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {getCurrentPageTitle()}
                        </h1>
                    </div>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;