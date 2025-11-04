

const FilterResults = () => {

  return (
    <>
      <div className="flex flex-row gap-5 justify-center flex-wrap">

        <button 
          className="border-2 border-gray-900 bg-gray-300 hover:bg-gray-400 text-black p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        >
          <p className="text-2xl">
            Print Label
          </p>
        </button>

        <button 
          className="border-2 border-gray-900 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        >
          <p className="text-2xl">
            Move
          </p>
        </button>

        <button 
          className="border-2 border-gray-900 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg shadow font-medium duration-300 ease-in-out"
        >
          <p className="text-2xl">
            Donate
          </p>
        </button>

      </div>

      <div className="flex-1 overflow-y-auto border-2 border-gray-300 rounded-lg p-6">

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between border-2 border-gray-900 bg-gray-300 hover:bg-white text-black p-2 mb-4 hover:mb-5 rounded shadow font-medium duration-300 ease-in-out">
          <p className="text-2xl">
            Box 25
          </p>
          <div className="flex flex-row justify-between flex-wrap text-lg">
            <p>
              Location: Aisle 3
            </p>
            <p>
              Qty: 5
            </p>
          </div>
        </div>

      </div>

    </>
  );

};

export default FilterResults;