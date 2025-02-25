import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
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

type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired" | "Other";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  // Default date values
  const defaultStartDate = new Date("2000-01-01");
  const defaultEndDate = new Date("2100-12-31");

  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [action, setAction] = useState<ActionTypes>("allActions");

  // Testing
  useEffect(() => {
    console.log("Action state changed:", action);
  }, [action]);

  useEffect(() => {
    console.log("Start date changed:", startDate);
  }, [startDate]);

  useEffect(() => {
    console.log("End date changed:", endDate);
  }, [endDate]);

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
          <DropdownMenuItem onClick={() => setAction("Other")}>
            Other
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
                setEndDate(newDate.toDate());
              }
            }}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default SearchBar;
