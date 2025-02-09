import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";


interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  const [tempInput, setTempInput] = useState(searchTerm);

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by box name..."
          value={tempInput}
          onChange={(e) => setTempInput(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button onClick={(e) => onSearchChange(tempInput)}>Search</Button>
    </div>
  );
};

export default SearchBar;
