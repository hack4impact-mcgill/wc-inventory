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

const NavigationLinks = () => {
    const location = useLocation();

    return (
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                            isActive
                                ? 'border-indigo-500  text-gray-900 dark:text-white'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:border-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </div>
    );
};

export default NavigationLinks;
