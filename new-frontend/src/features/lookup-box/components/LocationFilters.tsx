import { Shirt, Package, MapPin } from "lucide-react";


const LocationFilters = () => {

    return (
      <>
        <h2 className="text-xl font-bold text-gray-900 tracking-wide text-left md:text-center">
          Search
        </h2>
        <button 
          className="flex-1 flex items-center justify-center gap-3 bg-yellow-300 hover:bg-yellow-400 p-4 rounded-lg shadow font-medium"
        >
          <Shirt size={40} />
          <p className="text-xl">
            By Item
          </p>
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-3 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-lg shadow font-medium"
        >
          <Package size={40} /> 
          <p className="text-xl">
            Box ID
          </p>
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-3 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg shadow font-medium"
        >
          <MapPin size={40} />
          <p className="text-xl">
            By Location
          </p> 
        </button>
      </>
    );

};

export default LocationFilters;