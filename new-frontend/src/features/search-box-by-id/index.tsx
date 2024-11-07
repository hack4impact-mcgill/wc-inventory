import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Box } from '@/types/box'
import { mockBoxes } from './mock-data';
import debounce from 'lodash/debounce';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';

const CATEGORIES: Record<number, string> = {
  1: 'T-Shirts',
  2: 'Jackets',
  3: 'Socks',
  4: 'Shorts',
  // Add more categories as needed
};

const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <strong key={index} className="bg-blue-300 font-bold">{part}</strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

const BoxSearch = () => {
  const [searchId, setSearchId] = useState("");
  const [searchResults, setSearchResults] = useState<Box[]>([]);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [error, setError] = useState("");
  const [notFoundError, setNotFoundError] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // Search through mock database with stricter matching
      const results = mockBoxes.filter(box => {
        const boxId = String(box.box_id).toLowerCase();
        const searchQuery = query.toLowerCase();
        return boxId.includes(searchQuery); // Match the whole search term, not individual characters
      });
      
      // Sort results by relevance
      const sortedResults = results.sort((a, b) => {
        const aId = String(a.box_id).toLowerCase();
        const bId = String(b.box_id).toLowerCase();
        
        // Exact matches come first
        if (aId === query.toLowerCase()) return -1;
        if (bId === query.toLowerCase()) return 1;
        
        // Then matches at start of string
        if (aId.startsWith(query.toLowerCase()) && !bId.startsWith(query.toLowerCase())) return -1;
        if (!aId.startsWith(query.toLowerCase()) && bId.startsWith(query.toLowerCase())) return 1;
        
        // Then sort by position of match
        return aId.indexOf(query.toLowerCase()) - bId.indexOf(query.toLowerCase());
      });
      
      setSearchResults(sortedResults);
      setIsDropdownOpen(sortedResults.length > 0);
    }, 300),
    []
  );

  const validateInput = (value: string): string => {
    if (value.length > 20) {
      return "Box ID cannot exceed 20 characters";
    }
    
    if (!/^[a-zA-Z0-9-]*$/.test(value)) {
      return "Box ID can only contain letters, numbers, and hyphens";
    }

    return ""; // Empty string means no error
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const validationError = validateInput(searchId);
        if (validationError) {
          setError(validationError);
          return;
        }

        // Check if the box exists in mockBoxes
        const boxExists = mockBoxes.some(
          box => String(box.box_id).toLowerCase() === searchId.toLowerCase()
        );

        if (!boxExists) {
          setNotFoundError(`No box found with ID "${searchId}"`);
          setSearchResults([]);
          return;
        }

        setNotFoundError("");
        debouncedSearch(searchId);
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        const validationError = validateInput(searchId);
        if (validationError) {
          setError(validationError);
          return;
        }
        
        if (focusedIndex >= 0) {
          handleBoxSelect(searchResults[focusedIndex]);
        } else if (searchResults.length === 1) {
          handleBoxSelect(searchResults[0]);
        } else if (searchResults.length === 0) {
          setNotFoundError(`No box found with ID "${searchId}"`);
        }
        setIsDropdownOpen(false);
        break;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchId(value);
    setSelectedBox(null);
    setNotFoundError(""); // Clear not found error when typing
    
    const validationError = validateInput(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    
    if (value.length >= 1) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleBoxSelect = (box: Box) => {
    setSelectedBox(box);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Search Container */}
      <div 
        className="relative w-full"
        ref={dropdownRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchId}
            onChange={handleSearch}
            onFocus={() => {
              // Only show dropdown if we have both a search term and results
              if (searchId.trim() && searchResults.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            placeholder="Enter box ID (e.g., BOX001)"
            className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 ${
              error || notFoundError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
            }`}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Error messages */}
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        {notFoundError && (
          <p className="text-red-500 text-sm mt-1">{notFoundError}</p>
        )}

        {/* Dropdown Results */}
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((box, index) => (
              <div
                key={box.box_id}
                onClick={() => handleBoxSelect(box)}
                className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                  index === focusedIndex ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex-1">
                  <HighlightedText text={String(box.box_id)} highlight={searchId} />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {box.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBox && (
        <div className="mt-4 border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-bold text-lg mb-2">Box Details</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Box ID:</span>{" "}
              <HighlightedText text={String(selectedBox.box_id)} highlight={searchId} />
            </p>
            <p>
              <span className="font-medium">Name:</span> {selectedBox.name}
            </p>
            <p>
              <span className="font-medium">Description:</span> {selectedBox.description}
            </p>
            <p>
              <span className="font-medium">Location ID:</span> {selectedBox.location_id}
            </p>
            <div>
              <span className="font-medium">Contents:</span>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">See contents</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>See contents</DrawerTitle>
                    <DrawerDescription>ASDFSDF</DrawerDescription>
                  </DrawerHeader>

                </DrawerContent>

              </Drawer>

              <ul className="ml-4 mt-1">
                {selectedBox.contents.map((item) => (
                  <li key={item.box_content_id}>
                    {item.quantity}x {item.size} {CATEGORIES[item.category_id]} 
                    {item.gender !== 'U' && ` (${item.gender})`}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-medium">Movement:</span> {selectedBox.movement}
            </p>
            <p>
              <span className="font-medium">Tags:</span> {selectedBox.tags.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxSearch;