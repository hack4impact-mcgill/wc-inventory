import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = () => {
     
    return (
        // {/* <input className="rounded-lg border border-gray-300 w-80 mr-4 h-[30px] pl-2 focus:outline-none" type="text" placeholder="Search by box name"/> */}
        
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

/* //<div className="flex items-center justify-between">
<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
<Input
  placeholder="Search activities..."
  className="pl-8"
/>
<Button className="bg-black text-white h-4 w-[55px] mr-2" variant="secondary">Search</Button>
</div> */