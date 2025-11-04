
interface ItemFiltersProps {
  active: boolean;
  handleActive: () => void;
}

const ItemFilters = ({
  active,
  handleActive,
}: ItemFiltersProps) => {

  return (
    <>

      <button 
        className={`flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 p-4 rounded-lg shadow font-medium duration-300 ease-in-out 
          ${active ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
        onClick={handleActive}
      >
        <p className="text-3xl">
          {active ? "Active" : "Donated"}
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          All Items
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          All Genders
        </p>
      </button>

      <button 
        className="flex-1 flex items-center justify-center gap-3 border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          All Sizes
        </p>
      </button>

    </>
  );

};

export default ItemFilters;