import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired";


interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  setAction: (value: ActionTypes) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, setStartDate, setEndDate, setAction }) => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      {/* Search Input */}
      <div className="relative z-50">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by box name..."
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            console.log("Search term changed:", e.target.value);
          }}
          className="pl-8 w-[300px]"
        />
      </div>

      {/* Action Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline"className="h-9 w-[300px] rounded-md border border-neutral-200 bg-transparent text-sm"> 
            All actions 
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setAction("allActions")}>
            All actions (default)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("Donated")}>
            Donated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("Moved")}>
            Moved
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction("Retired")}>
            Retired
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Range Filter */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-row space-x-2">
          <DatePicker
            label="Start Date"
            onChange={(newDate) => {
              if (newDate) {
                setStartDate(newDate.toDate());
              }
            }}
          />
          <DatePicker
            label="End Date"
            onChange={(newDate) => {
              if (newDate) {
                setEndDate(newDate.add(1, 'day').toDate());
              }
            }}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default SearchBar;
