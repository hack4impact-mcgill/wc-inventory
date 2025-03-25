import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  setAction: (value: ActionTypes) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  setStartDate,
  setEndDate,
  setAction,
}) => {
  return (
    <div className="pb-11 flex flex-row justify-between">
      {/* Search Input */}
      <div className="flex flex-row gap-2">
        <div className="relative">
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 text-muted-foreground " />
          <Input
            placeholder="Search by box name..."
            value={searchTerm}
            className="rounded-md pl-3 w-60 h-[40px] p-4 font-poppins font-normal texborder focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:border-gray-300 shadow-none"
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-md pl-3 w-60 h-[40px] p-4 font-poppins font-normal border focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus:border-gray-300 bg-transparent shadow-none"
            >
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
      </div>

      {/* Date Range Filter */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-row gap-3 pl-52">
          <DatePicker
            label=""
            slotProps={{
              textField: {
                placeholder: "Start Date",
                InputProps: {
                  sx: {
                    height: "40px",
                    pl: "5px",
                    backgroundColor: "transparent",
                  },
                },
                sx: {
                  width: "15rem",
                  height: "40px",
                  borderRadius: "0.3rem",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",

                  // 💡 Style the input text when NOT focused and when focused
                  "& .MuiInputBase-input": {
                    color: "#000", // Make the input text black
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    fontFamily: "Poppins",
                  },

                  // 💡 Style the placeholder text
                  "& .MuiInputBase-input::placeholder": {
                    color: "#000", // Force black placeholder
                    opacity: 1, // Required to make the color show
                  },

                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                },
              },
            }}
            onChange={(newDate) => {
              if (newDate) {
                setStartDate(newDate.toDate());
              }
            }}
          />
          <DatePicker
            label=""
            slotProps={{
              textField: {
                placeholder: "End Date",
                InputProps: {
                  sx: {
                    height: "40px",
                    pl: "5px",
                    backgroundColor: "transparent",
                  },
                },
                sx: {
                  width: "15rem",
                  height: "40px",
                  borderRadius: "0.3rem",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",

                  // 💡 Style the input text when NOT focused and when focused
                  "& .MuiInputBase-input": {
                    color: "#000", // Make the input text black
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    fontFamily: "Poppins",
                  },

                  // 💡 Style the placeholder text
                  "& .MuiInputBase-input::placeholder": {
                    color: "#000", // Force black placeholder
                    opacity: 1, // Required to make the color show
                  },

                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                },
              },
            }}
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
