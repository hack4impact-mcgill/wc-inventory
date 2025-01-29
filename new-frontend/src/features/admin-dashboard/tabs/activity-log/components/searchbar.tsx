import { Button } from "@/components/ui/button";

const SearchBar = () => {
    
    
    return (
        <div className="flex">
            <input className="rounded-lg border border-gray-300 w-80 mr-4 h-[30px] pl-2 focus:outline-none" type="text" placeholder="Search by box name"/>
            <Button className="bg-gray-300 h-[29px] mt-0.4 w-[55px]" variant="secondary">Search</Button>
        </div>
    );


};

export default SearchBar;