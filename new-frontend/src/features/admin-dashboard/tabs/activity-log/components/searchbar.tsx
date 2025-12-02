import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RotateCw, Search } from "lucide-react";

type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  setStartDate: (value: Date) => void;
  setEndDate: (value: Date) => void;
  setAction: (value: ActionTypes) => void;
  onRefetch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  setStartDate,
  setEndDate,
  setAction,
  onRefetch,
}) => {
  return (
    <div className="flex justify-between mb-4 items-center">
      {/* Search Input */}
      <div className="flex flex-row gap-2 items-center">
        <div className="relative bg-white flex items-center">
          <Search className="absolute left-2 size-4 text-muted-foreground " />
          <Input
            placeholder="Search by box name..."
            value={searchTerm}
            className="pl-8"
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
          />
        </div>

        <Button
          onClick={onRefetch}
          variant="outline"
          size="icon"
          className="bg-white rounded-md border"
        >
          <RotateCw />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">All actions</Button>
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
        <div className="flex flex-row gap-3 pl-5">
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
                    fontFamily: "var(--font-sans)",
                  },

                  // 💡 Style the placeholder text
                  "& .MuiInputBase-input::placeholder": {
                    color: "#000", // Force black placeholder
                    opacity: 1, // Required to make the color show
                    fontFamily: "var(--font-sans)",
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
