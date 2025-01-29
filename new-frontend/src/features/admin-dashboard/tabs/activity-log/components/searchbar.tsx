import { Button } from "@/components/ui/button";

const SearchBar = () => {
    
    
    return (
        <div>
            <input className="rounded-lg border border-gray-300 w-80 mr-6 h-8 pl-2 focus:outline-none" type="text" placeholder="Search by box name"/>
            <Button className="bg-gray-300 h-7" variant="secondary">Search</Button>
        </div>
    );


};

export default SearchBar;