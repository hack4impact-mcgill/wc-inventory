import { BoxView } from "@/types/box";
import { Button } from "@/components/ui/button";
import BoxesTable from "@/features/admin-dashboard/tabs/box-lookup/components/BoxesTable";


interface FilterResultsProps {
  handlePrintLabel: () => void;
  handleMoveClick: () => void;
  handleDonateClick: () => void;
  handleBoxSelect: (boxId: string) => void;
  handleSelectAll: () => void;
  filteredBoxes: BoxView[];
  selectedBoxIds: string[];
}

const FilterResults = ({
  handlePrintLabel,
  handleMoveClick,
  handleDonateClick,
  handleBoxSelect,
  handleSelectAll,
  filteredBoxes,
  selectedBoxIds,
}: FilterResultsProps) => {


  return (
    <>
      <div className="flex flex-row gap-5 justify-center">

        <Button variant="outline" 
          className="xs:max-w-[4rem] max-w-[8rem] xs:p-2 p-4 h-full"
          onClick={handlePrintLabel}
        >
          Print label
        </Button>      

        <Button variant="outline" 
          className="xs:max-w-[4rem] max-w-[8rem] xs:p-2 p-4 h-full"
          onClick={handleMoveClick}
        >
          Move
        </Button>     

        <Button variant="outline" 
          className="xs:max-w-[4rem] max-w-[8rem] xs:p-2 p-4 h-full"
          onClick={handleDonateClick}
        >
          Donate
        </Button>     

      </div>

      <BoxesTable
        boxes={filteredBoxes}
        selectedBoxIds={selectedBoxIds}
        onBoxSelect={handleBoxSelect}
        onSelectAll={handleSelectAll}
      />

    </>
  );

};

export default FilterResults;