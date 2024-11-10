import { useState } from "react";
import { Command, CommandEmpty, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { Box } from "@/types/box";

interface ICommandProps {
  boxes: Box[];
}

export default function CommandSearch({ boxes }: ICommandProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredBoxes = Array.isArray(boxes)
    ? boxes.filter((box) =>
        box.box_id.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  // console.log("filteredBoxes", filteredBoxes);

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Enter box ID..."
        onValueChange={handleValueChange}
      />

      <div>
        {
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            {open &&
              filteredBoxes.length > 0 &&
              filteredBoxes.map((box) => (
                <CommandItem key={box.box_id} value={box.name}>
                  {box.box_id}
                </CommandItem>
              ))}
          </CommandList>
        }

    </div>

    </Command>
  );
}