import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import MainFilters from "./components/MainFilters"
import ItemFilters from "./components/ItemFilters"
import BoxFilters from "./components/BoxFilters"
import LocationFilters from "./components/LocationFilters"
import FilterResults from "./components/FilterResults"


const LookupBox = () => {

  const navigate = useNavigate();
  const [view, setView] = useState< "main-filter" | "item-filter" | "box-filter" | "location-filter" | "filter-results">("main-filter");
  const [prevView, setPrevView] = useState< "main-filter" | "item-filter" | "box-filter" | "location-filter" | "filter-results">("main-filter");
  const [active, setActive] = useState<boolean>(false);
  
  const handleBack = () => {
    if (view === "main-filter") {
      navigate("/");
    }
    else {
      setView(prevView);
      setPrevView("main-filter");
    }
  };

  const handleItemFilter = () => {
    setView("item-filter"); 
  };

  const handleBoxFilter = () => {
    setView("box-filter"); 
  }; 

  const handleLocationFilter = () => {
    setView("location-filter"); 
  };

  const handleActive = () => {
    setActive(!active);
  };

  const handleSearch = () => {
    setPrevView(view);
    setView("filter-results"); 
  };

  const title = view === "filter-results"
    ? "Inventory Management"
    : view === "item-filter"
      ? "Search Box by Item"
      : view === "box-filter"
        ? "Search Box by ID"
        : view === "location-filter"
          ? "Search Box by Location"
          : "Inventory Management";
        
    return (
    <div className="h-screen flex flex-col items-center bg-white px-4 overflow-hidden">
      
      <div className="flex-[1] basis-0 w-full max-w-screen-md flex flex-col justify-center items-start mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-wide text-center mb-8">
          {title}
        </h1>
        <button 
          className="p-2 rounded-md border-2 border-gray-900 bg-gray-300 hover:bg-gray-400 mb-3 duration-300 ease-in-out"
          onClick={handleBack}
        >
          <ArrowLeft size={40} />
        </button>
      </div>

      <div className="flex-[4] basis-0 w-full max-w-screen-md flex flex-col justify-center gap-12 overflow-hidden">

        {view === "main-filter" && (
          <MainFilters
            handleItemFilter={handleItemFilter}
            handleBoxFilter={handleBoxFilter} 
            handleLocationFilter={handleLocationFilter}
          /> 
        )}

        {view === "item-filter" && (
          <ItemFilters
            active={active}
            handleActive={handleActive}
          /> 
        )}

        {view === "box-filter" && (
          <BoxFilters/> 
        )}

        {view === "location-filter" && (
          <LocationFilters/> 
        )}

        {view === "filter-results" && (
          <>
            <FilterResults/> 
            <div className="flex justify-center">
              <button 
                className="w-3/4 border-2 border-gray-900 bg-yellow-300 hover:bg-yellow-400 text-black p-4 rounded-3xl shadow font-medium duration-300 ease-in-out"
              >
                <p className="text-2xl">
                  View Contents
                </p>
              </button>
            </div>
          </>
        )}

        {["item-filter", "box-filter", "location-filter"].includes(view) && (
          <div className="flex-1 flex justify-center">
            <button 
              className="w-3/4 border-2 border-gray-900 bg-gray-950 hover:bg-gray-700 text-white p-4 rounded-3xl shadow font-medium duration-300 ease-in-out"
              onClick={handleSearch}
            >
              <p className="text-2xl">
                Search
              </p>
            </button>
          </div>
        )}

      </div>

    </div>
  );

};

export default LookupBox;
