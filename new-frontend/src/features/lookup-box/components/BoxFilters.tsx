

const BoxFilters = () => {

  return (
    <>

      <h2 className="flex-1 flex flex-col justify-end text-2xl font-bold text-gray-900 tracking-wide text-center">
        Input Box ID(s)
      </h2>

      <button 
        className="flex-[4] flex flex-col justify-center border-2 border-gray-900 bg-gray-200 hover:bg-gray-300 text-black p-4 mb-8 rounded-lg shadow font-medium duration-300 ease-in-out"
      >
        <p className="text-3xl">
          e.g. Box-04
        </p>
      </button>

    </>
  );

};

export default BoxFilters;