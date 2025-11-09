import { BoxView } from "@/types/box";


interface FilterResultsProps {
  handlePrintLabel: () => void;
  handleMoveClick: () => void;
  handleDonateClick: () => void;
  handleBoxSelect: (boxId: string) => void;
  filteredBoxes: BoxView[];
  selectedBoxIds: string[];
}

const FilterResults = ({
  handlePrintLabel,
  handleMoveClick,
  handleDonateClick,
  handleBoxSelect,
  filteredBoxes,
  selectedBoxIds,
}: FilterResultsProps) => {


  return (
    <>
      <div className="flex flex-row gap-5 justify-center flex-wrap">

        <button 
          className="border-2 border-gray-900 bg-gray-300 hover:bg-gray-400 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
          onClick={handlePrintLabel}
        >
          <p className="text-2xl">
            Print Label
          </p>
        </button>

        <button 
          className="border-2 border-gray-900 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
          onClick={handleMoveClick}
        >
          <p className="text-2xl">
            Move
          </p>
        </button>

        <button 
          className="border-2 border-gray-900 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
          onClick={handleDonateClick}
        >
          <p className="text-2xl">
            Donate
          </p>
        </button>

      </div>

      <div className="flex-1 overflow-y-auto border-2 border-gray-300 rounded-lg p-6">
        {filteredBoxes.length > 0
          ? (
              filteredBoxes.map((box) => (
                <div 
                  key={box.id}
                  className={`flex flex-col justify-between border-2 border-gray-900 bg-gray-300 text-black p-2 mb-4 rounded shadow font-medium duration-300 ease-in-out lg:hover:cursor-pointer
                    ${selectedBoxIds?.includes(box.id) ? "bg-white text-black mb-5" : "bg-gray-300 lg:hover:bg-white text-black lg:hover:mb-5"}`}
                  onClick={() => handleBoxSelect(box.id)}
                >
                  <p className="text-2xl">
                    {box.name}
                  </p>
                  <div className="flex flex-row justify-between flex-wrap text-lg">
                    <p>
                      Location: {box.location === null ? "—" : box.location}
                    </p>
                    <p>
                      Qty: {box.contents?.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          ) || 0}
                    </p>
                  </div>
                </div>
              ))
          )
          : (
            <p className="text-2xl text-center text-black">
              No boxes found matching your filters
            </p>
          )
        }
      </div>

    </>
  );

};

export default FilterResults;