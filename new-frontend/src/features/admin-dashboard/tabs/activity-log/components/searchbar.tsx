import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
     
    return (
        <div className="flex items-center justify-between">
            <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Search locations..." className="pl-8"/>
            </div>
            <Button>Search</Button>
        </div> 
    );


};

export default SearchBar;
