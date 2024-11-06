import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Location } from "@/types/location";

interface TreeItemProps {
  item: Location;
  items: ReadonlyArray<Location>;
  level: number;
  selectedId: number | null;
  expanded: number[];
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  items,
  level,
  selectedId,
  expanded,
  onToggle,
  onSelect,
}) => {
  const children = items.filter(
    (child) => child.parent_id === item.location_id,
  );
  const hasChildren = children.length > 0;
  const isExpanded = expanded.includes(item.location_id);
  const isSelected = selectedId === item.location_id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-sm transition-colors",
          !isSelected && "hover:bg-neutral-50",
          isSelected && "bg-neutral-200",
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        <div className="flex-1 flex items-center">
          {hasChildren ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(item.location_id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <span className="w-6" />
          )}
          <Button
            type="button"
            variant="ghost"
            className={cn(
              "px-2 h-8 flex-1 justify-start font-normal hover:bg-transparent",
              isSelected && "font-medium",
            )}
            onClick={() => onSelect(item.location_id)}
          >
            {item.name}
            {item.description && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({item.description})
              </span>
            )}
          </Button>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-2">
          {children.map((child) => (
            <TreeItem
              key={child.location_id}
              item={child}
              items={items}
              level={level + 1}
              selectedId={selectedId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeItem;
