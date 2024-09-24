import { DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';

type NavigationItem = {
    name: string;
    href: string;
};

const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/' },
    { name: 'Admin', href: '/admin' },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const MobileMenu = () => {
    const location = useLocation();

    return (
        <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <DisclosureButton
                            key={item.name}
                            as={Link}
                            to={item.href}
                            className={classNames(
                                isActive
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-700 dark:border-gray-500 dark:text-white'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white',
                                'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                            )}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {item.name}
                        </DisclosureButton>
                    );
                })}
            </div>
        </DisclosurePanel>
    );
};

export default MobileMenu;
