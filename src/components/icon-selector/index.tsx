import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CommandInput,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react"; 
import { getCategoryIconPath, getAvailableIconNames } from "@/lib/iconLoader"; 

interface IconSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
}


const IconSelector: FC<IconSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const iconNames = getAvailableIconNames();

  const CurrentIcon = value
    ? getCategoryIconPath(value)
    : getCategoryIconPath("default");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className ?? "w-[200px] justify-between"}
        >
          <div className="flex items-center gap-2">
            <img
              src={CurrentIcon}
              alt={value ?? "icon"}
              className="h-4 w-4 object-contain"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/icons/default.svg")
              }
            />
            <span>{value || "Select icon..."}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[200px] p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput
            placeholder="Search icons..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No icons found.</CommandEmpty>

          <ScrollArea className="h-64">
            <CommandGroup>
              {iconNames
                .filter((name) =>
                  name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((name) => {
                  const iconPath = getCategoryIconPath(name);
                  return (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        onChange(name);
                        setOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <img
                        src={iconPath}
                        alt={name}
                        className="h-4 w-4 object-contain"
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/icons/default.svg")
                        }
                      />
                      <span>{name}</span>
                      {value === name && (
                        <Check className="ml-auto h-4 w-4 text-muted-foreground" />
                      )}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
