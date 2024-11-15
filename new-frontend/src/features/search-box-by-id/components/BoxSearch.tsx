import { useState, useEffect } from "react";
import { CommandEmpty, CommandInput, CommandList, CommandItem, CommandGroup, CommandDialog } from '@/components/ui/command';
import { Box } from "@/types/box";
import { Search, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import BoxDetails from "./BoxDetails";
import { useNavigate, useSearchParams } from "react-router-dom";

interface BoxSearchProps {
  boxes: Box[];
}

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

// Utility functions for localStorage operations
const STORAGE_KEY = "boxSearchHistory";

const getStoredHistory = (): Box[] => {
  try {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveToStorage = (history: Box[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

export default function BoxSearch({ boxes = [] }: BoxSearchProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [open, setOpen] = useState(true);
  const [searchHistory, setSearchHistory] = useState<Box[]>(() => getStoredHistory());
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Check if localStorage is available
  useEffect(() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setStorageAvailable(true);
    } catch (e) {
      setStorageAvailable(false);
      console.warn('localStorage is not available:', e);
    }
  }, []);

  // Load search history only once on component mount
  useEffect(() => {
    if (storageAvailable) {
      const history = getStoredHistory();
      setSearchHistory(history);
    }
  }, [storageAvailable]);

 // Handle URL parameter changes and initialize selected box
  useEffect(() => {
    const boxId = searchParams.get('id');
    if (boxId) {
      const box = boxes.find(b => b.box_id === boxId);
      if (box) {
        setSelectedBox(box);
        setOpen(false);
      }
    } else {
      setSelectedBox(null);
    }
  }, [searchParams, boxes]);

  // Save search history whenever it changes
  useEffect(() => {
    if (storageAvailable && searchHistory.length > 0) {
      saveToStorage(searchHistory);
    }
  }, [searchHistory, storageAvailable]);

  const handleSelect = (boxId: string) => {
    const box = boxes.find(b => b.box_id === boxId);
    if (box) {
      // Update URL with the selected box ID
      setSearchParams({ id: boxId });
      
      setSelectedBox(box);
      setSearchQuery("");
      setOpen(false);
      
      if (storageAvailable) {
        setSearchHistory(prev => {
          const updatedHistory = [box, ...prev.filter(b => b.box_id !== boxId)].slice(0, 5);
          return updatedHistory;
        });
      }
    }
  };

  const clearHistory = () => {
    if (storageAvailable) {
      setSearchHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const filteredBoxes = boxes.filter(box => {
    const boxId = String(box.box_id).toLowerCase();
    const query = searchQuery.toLowerCase();
    return boxId.includes(query);
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex justify-center">
        <Button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search Box by ID
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search Boxes</DialogTitle>
        <CommandInput
          placeholder="Enter box ID (e.g., BOX001)"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty className="p-4 text-sm">
            No boxes found matching your search.
          </CommandEmpty>
          {searchQuery === "" && searchHistory.length > 0 ? (
            <CommandGroup heading="Recent Searches">
              {searchHistory.map((box) => (
                <CommandItem
                  key={box.box_id}
                  value={box.box_id.toString()}
                  onSelect={() => handleSelect(box.box_id.toString())}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <HighlightedText text={box.box_id.toString()} highlight={searchQuery} />
                  </div>
                  <span className="text-sm text-gray-500">{box.name}</span>
                </CommandItem>
              ))}
              <Button onClick={clearHistory} className="mt-2">Clear History</Button>
            </CommandGroup>
          ) : filteredBoxes.length > 0 ? (
            <CommandGroup heading="Boxes">
              {filteredBoxes.map((box) => (
                <CommandItem
                  key={box.box_id}
                  value={box.box_id.toString()}
                  onSelect={() => handleSelect(box.box_id.toString())}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <HighlightedText text={box.box_id.toString()} highlight={searchQuery} />
                  </div>
                  <span className="text-sm text-gray-500">{box.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>

      {selectedBox && (
        <BoxDetails selectedBox={selectedBox} />
      )}
    </div>
  );
}