import { Users } from 'lucide-react';

const UserManagement = () => {
    return (
        <div className="h-[70vh] flex items-center justify-center">
            <section className="relative block w-full max-w-6xl mx-auto rounded-lg border-2 border-dashed border-gray-300 p-12 py-24 text-center">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Coming Soon!</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This feature is currently under development
                </p>
            </section>
        </div>
    );
};

export default UserManagement;