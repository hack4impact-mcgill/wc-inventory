import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Location } from '@/types/location';

interface TreeSelectProps {
    items: ReadonlyArray<Location>;
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    disabled?: boolean;
    className?: string;
}

const TreeSelect = ({
    items,
    selectedId,
    onSelect,
    disabled = false,
    className,
}: TreeSelectProps): JSX.Element => {
    const [expanded, setExpanded] = React.useState<number[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredItems = React.useMemo(() => {
        if (!searchTerm) return items;
        const search = searchTerm.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.description?.toLowerCase().includes(search)
        );
    }, [items, searchTerm]);

    const handleToggle = (id: number) => {
        setExpanded(prev => {
            const isExpanded = prev.includes(id);
            return isExpanded
                ? prev.filter(x => x !== id)
                : [...prev, id];
        });
    };
    const renderItem = (item: Location, level: number = 0) => {
        const children = items.filter(child => child.parent_id === item.location_id);
        const hasChildren = children.length > 0;
        const isExpanded = expanded.includes(item.location_id);
        const isSelected = selectedId === item.location_id;

        return (
            <div key={item.location_id}>
                <div
                    className={cn(
                        "flex items-center py-1 px-2 rounded-sm transition-colors",
                        !isSelected && "hover:bg-neutral-50",
                        isSelected && "bg-neutral-200",
                    )}
                    style={{ paddingLeft: `${(level * 20) + 8}px` }}
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
                                    handleToggle(item.location_id);
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
                                isSelected && "font-medium"
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
                        {children.map(child => renderItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className={cn("p-2", className)}>
            <div className="space-y-4">
                <Input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                />
                <div className="space-y-1">
                    <Button
                        type="button"
                        variant="ghost"
                        className={cn(
                            "w-full justify-start font-normal hover:bg-transparent",
                            !selectedId && "bg-neutral-200",
                            selectedId !== null && "hover:bg-neutral-50"
                        )}
                        onClick={() => onSelect(null)}
                    >
                        No Parent
                    </Button>
                    <div className="max-h-[200px] overflow-y-auto">
                        {filteredItems
                            .filter(item => item.parent_id === null)
                            .map(item => renderItem(item))}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TreeSelect;