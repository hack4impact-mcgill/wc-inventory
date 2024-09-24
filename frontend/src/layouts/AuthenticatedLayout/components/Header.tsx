import { Disclosure, DisclosureButton } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import NavigationLinks from './NavigationLinks';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';

export default function Header() {
    return (
        <Disclosure as="nav" className="bg-white fixed top-0 z-50 w-full shadow dark:bg-gray-900 dark:shadow-md">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile Button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="block h-6 w-6 group-data-[open]:hidden" aria-hidden="true" />
                            <XMarkIcon className="hidden h-6 w-6 group-data-[open]:block" aria-hidden="true" />
                        </DisclosureButton>
                    </div>

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-8 w-auto" src="/logo.png" alt="Company Logo" />
                        </div>
                        <NavigationLinks />
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <UserDropdown />
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <MobileMenu />
        </Disclosure>
    );
}
