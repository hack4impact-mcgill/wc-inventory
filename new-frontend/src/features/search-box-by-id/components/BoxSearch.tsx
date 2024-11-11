import { useState } from "react";
import { CommandEmpty, CommandInput, CommandList, CommandItem, CommandGroup, CommandDialog } from '@/components/ui/command';
import { Box } from "@/types/box";
import { Search, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import BoxDetails from "./BoxDetails";


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

export default function BoxSearch({ boxes = [] }: BoxSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (boxId: string) => {
    const box = boxes.find(b => b.box_id === boxId);
    if (box) {
      setSelectedBox(box);
      setSearchQuery("");
      setOpen(false);
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
          {filteredBoxes.length > 0 && (
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
          )}
        </CommandList>
      </CommandDialog>

      {selectedBox && (
        <BoxDetails selectedBox={selectedBox} />
      )}
    </div>
  );
}