import { type FC, useState } from "react";
import * as Icons from "lucide-react";
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
import { Check, Folder, LucideIcon } from "lucide-react";

// Exclude non-icon exports from lucide-react
type IconKeys = Exclude<
  keyof typeof Icons,
  "createLucideIcon" | "icons" | "default"
>;

// Create a record of only the icon components
const iconComponents: Record<string, LucideIcon> = Object.fromEntries(
  Object.entries(Icons).filter(
    ([key]) =>
      typeof Icons[key as keyof typeof Icons] === "function" &&
      !["createLucideIcon", "icons", "default"].includes(key),
  ),
) as Record<string, LucideIcon>;

const iconNames = Object.keys(iconComponents);

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const IconSelector: FC<IconSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the current icon component or fallback to Folder
  const CurrentIcon =
    value && iconComponents[value] ? iconComponents[value] : Folder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
                  const Icon = iconComponents[name];
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
