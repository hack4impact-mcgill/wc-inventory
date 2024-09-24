import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useAuthContext } from '@/contexts/AuthContext';

const UserDropdown = () => {
    const { user, logout } = useAuthContext();

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center cursor-pointer justify-center h-12 w-12 rounded-full bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-300 !outline-none">
                <span className="text-base font-medium">{user?.username?.charAt(0).toUpperCase()}</span>
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-600">
                <MenuItem>
                    <button
                        onClick={logout}
                        className="block w-full cursor-pointer !outline-none !boder-none !ring-transparent px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Sign out
                    </button>
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

export default UserDropdown;
