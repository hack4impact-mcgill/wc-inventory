import { type FC, useEffect, useState, useRef } from "react";
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
import { Check, Edit2, Save, Trash2, X } from "lucide-react";
import { getAllIcons, renameIcon, deleteIcon } from "@/lib/iconLoader";

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
  const [iconNames, setIconNames] = useState<string[]>([]);
  const [iconsMap, setIconsMap] = useState<Record<string, string>>({});
  const [iconIds, setIconIds] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const ignoreBlurRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const icons = await getAllIcons();

        const names: string[] = [];
        const map: Record<string, string> = {};
        const ids: Record<string, string> = {};

        for (const icon of icons) {
          names.push(icon.name);
          if (icon.data) map[icon.name] = icon.data;
          ids[icon.name] = icon.icon_id;
        }

        setIconNames(names);
        setIconsMap(map);
        setIconIds(ids);
      } catch (err) {
        console.error("Failed to load icons:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRename = async (oldName: string) => {
    const newName = tempName.trim();
    if (!newName || newName === oldName) {
      setEditingName(null);
      return;
    }

    try {
      setSaving(true);
      await renameIcon(iconIds[oldName], newName);

      // Update UI locally
      setIconNames((prev) => prev.map((n) => (n === oldName ? newName : n)));
      setIconsMap((prev) => {
        const updated = { ...prev };
        updated[newName] = prev[oldName];
        delete updated[oldName];
        return updated;
      });
      setIconIds((prev) => {
        const updated = { ...prev };
        updated[newName] = prev[oldName];
        delete updated[oldName];
        return updated;
      });

      if (value === oldName) onChange(newName);
    } catch (err) {
      console.error("Rename failed:", err);
    } finally {
      setSaving(false);
      setEditingName(null);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteIcon(iconIds[name]);
      setIconNames((prev) => prev.filter((n) => n !== name));
      setIconsMap((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      setIconIds((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
      if (value === name) onChange("");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const currentIcon =
    (value && iconsMap[value]) ||
    "/src/assets/category_icons/Folder.svg";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className ?? "w-[200px] justify-between"}
          disabled={loading}
        >
          <div className="flex items-center gap-2">
            <img
              src={currentIcon}
              alt={value ?? "icon"}
              className="h-4 w-4 object-contain"
              onError={(e) =>
                ((e.currentTarget as HTMLImageElement).src =
                  "/src/assets/category_icons/Folder.svg")
              }
            />
            <span>{value || "Select icon..."}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[260px] p-0"
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput
            placeholder="Search icons..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {loading ? "Loading icons..." : "No icons found."}
          </CommandEmpty>

          {!loading && (
            <ScrollArea className="h-64">
              <CommandGroup>
                {iconNames
                  .filter((name) =>
                    name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((name) => (
                    <CommandItem
                      key={name}
                      value={name}
                      onSelect={() => {
                        if (editingName) return;
                        onChange(name);
                        setOpen(false);
                      }}
                      className="cursor-pointer grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2"
                    >
                      <img
                        src={iconsMap[name]}
                        alt={name}
                        className="h-4 w-4 object-contain justify-self-start"
                        onError={(e) =>
                          ((e.currentTarget as HTMLImageElement).src =
                            "/src/assets/category_icons/Folder.svg")
                        }
                      />

                      <div className="flex items-center min-w-0">
                        {editingName === name ? (
                          <input
                            autoFocus
                            className="border px-1 rounded-sm text-sm bg-white outline-none w-full truncate"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                ignoreBlurRef.current = true;
                                handleRename(name);
                              }
                              if (e.key === "Escape") {
                                ignoreBlurRef.current = true;
                                setEditingName(null);
                              }
                            }}
                            onBlur={() => {
                              if (ignoreBlurRef.current) {
                                ignoreBlurRef.current = false;
                                return;
                              }
                              handleRename(name);
                            }}
                          />
                        ) : (
                          <span className="truncate max-w-[130px]">{name}</span>
                        )}
                        {value === name && (
                          <Check className="ml-1 h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1 justify-self-end">
                        {editingName === name ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-green-600"
                              onMouseDown={() =>
                                (ignoreBlurRef.current = true)
                              } 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(name);
                              }}
                            >
                              <Save size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400"
                              onMouseDown={() =>
                                (ignoreBlurRef.current = true)
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingName(null);
                              }}
                            >
                              <X size={14} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingName(name);
                                setTempName(name);
                              }}
                            >
                              <Edit2 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(name);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconSelector;