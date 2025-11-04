

const LocationFilters = () => {

  return (
    <>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          Select Room
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          Select Level
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          Select Aisle
        </p>
      </button>

    </>
  );

};

export default LocationFilters;