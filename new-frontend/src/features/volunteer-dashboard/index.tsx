import { PackageMinus, PackageOpen, PackagePlus, PackageSearch } from 'lucide-react';

const VolunteerDashboard = () => {
    return (
        <div className="p-4 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-120px)]">

                <div className="bg-green-500 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 hover:bg-green-600 transition-colors">
                    <PackageSearch className="w-20 h-20 text-white mb-4" />
                    <span className="text-2xl font-bold text-white">Search for Items</span>
                    {/* <span className="text-4xl font-bold text-white mt-2">12</span> */}
                </div>

                <div className="bg-blue-500 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 hover:bg-blue-600 transition-colors">
                    <PackageMinus className="w-20 h-20 text-white mb-4" />
                    <span className="text-2xl font-bold text-white">Move Box</span>
                    {/* <span className="text-4xl font-bold text-white mt-2">245</span> */}
                </div>

                <div className="bg-purple-500 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 hover:bg-purple-600 transition-colors">
                    <PackageOpen className="w-20 h-20 text-white mb-4" />
                    <span className="text-2xl font-bold text-white">Open / Move Box Upstairs</span>
                    {/* <span className="text-4xl font-bold text-white mt-2">1,234</span> */}
                </div>

                <div className="bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-center p-6 hover:bg-red-600 transition-colors">
                    <PackagePlus className="w-20 h-20 text-white mb-4" />
                    <span className="text-2xl font-bold text-white">Add New Box</span>
                    {/* <span className="text-4xl font-bold text-white mt-2">5,678</span> */}
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;