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
import { Check, Folder } from "lucide-react";
import { CATEGORY_ICONS, type CategoryIconName } from "@/types/icons";

interface IconSelectorProps {
  value: string | null;
  onChange: (value: CategoryIconName) => void;
  className?: string;
}

const IconSelector: FC<IconSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all icon names
  const iconNames = Object.keys(CATEGORY_ICONS) as CategoryIconName[];

  // Get current icon component
  const CurrentIcon =
    value && CATEGORY_ICONS[value as CategoryIconName]
      ? CATEGORY_ICONS[value as CategoryIconName]
      : Folder;

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
            <CurrentIcon className="h-4 w-4" />
            <span>{value || "Select icon..."}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search icons..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No icons found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-64">
              {iconNames
                .filter((name) =>
                  name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((name) => {
                  const Icon = CATEGORY_ICONS[name];
                  return (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        onChange(name);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{name}</span>
                      </div>
                      {value === name && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  );
                })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;
