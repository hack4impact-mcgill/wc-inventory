import { Shirt, Package, MapPin } from "lucide-react";


interface MainFiltersProps {
  handleItemFilter: () => void;
  handleBoxFilter: () => void;
  handleLocationFilter: () => void;
}

const MainFilters = ({
  handleItemFilter,
  handleBoxFilter,
  handleLocationFilter,
}: MainFiltersProps) => {

  return (
    <>

      <h2 className="text-xl font-bold text-gray-900 tracking-wide text-left">
        Search
      </h2>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-yellow-300 hover:bg-yellow-400 p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        onClick={handleItemFilter}
      >
        <Shirt size={40} />
        <p className="text-xl">
          By Item
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        onClick={handleBoxFilter}
      >
        <Package size={40} /> 
        <p className="text-xl">
          By Box ID
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        onClick={handleLocationFilter}  
      >
        <MapPin size={40} />
        <p className="text-xl">
          By Location
        </p> 
      </button>

    </>
  );

};

export default MainFilters;