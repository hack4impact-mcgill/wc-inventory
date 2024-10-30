import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => (
  <Input
    type="text"
    placeholder="Search locations..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-8"
  />
);

export default SearchInput;
