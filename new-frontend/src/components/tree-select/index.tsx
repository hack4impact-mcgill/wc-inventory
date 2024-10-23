import React from 'react';
import { Button } from '@/components/ui/button';
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
    const [expanded, setExpanded] = React.useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = React.useState<string>('');

    // Memoize the filtered items
    const filteredItems = React.useMemo(() => {
        if (!searchTerm) return items;

        return items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    // Get all parent IDs for a given item
    const getParentChain = React.useCallback((itemId: number | null): number[] => {
        const chain: number[] = [];
        let currentId = itemId;

        while (currentId) {
            const parent = items.find(item => item.location_id === currentId);
            if (!parent?.parent_id) break;
            chain.push(parent.parent_id);
            currentId = parent.parent_id;
        }

        return chain;
    }, [items]);

    // Expand all parents of the selected item
    React.useEffect(() => {
        if (selectedId) {
            const parentChain = getParentChain(selectedId);
            setExpanded(new Set([...expanded, ...parentChain]));
        }
    }, [selectedId, getParentChain]);

    const toggleExpanded = (id: number) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const buildTree = (parentId: number | null = null, level: number = 0): JSX.Element[] => {
        return filteredItems
            .filter(item => item.parent_id === parentId)
            .map(item => {
                const children = buildTree(item.location_id, level + 1);
                const isExpanded = expanded.has(item.location_id);
                const isSelected = selectedId === item.location_id;
                const hasChildren = children.length > 0;

                // Prevent selecting an item as its own parent
                const isDisabledItem = disabled || (
                    selectedId !== null &&
                    getParentChain(item.location_id).includes(selectedId)
                );

                return (
                    <div
                        key={item.location_id}
                        style={{ marginLeft: `${level * 1.5}rem` }}
                        role="treeitem"
                        aria-expanded={hasChildren ? isExpanded : undefined}
                        aria-selected={isSelected}
                    >
                        <div className="flex items-center py-1">
                            {hasChildren ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                    onClick={() => toggleExpanded(item.location_id)}
                                    disabled={disabled}
                                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </Button>
                            ) : (
                                <span className="w-4" />
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "ml-2 flex-grow justify-start",
                                    isSelected && "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
                                    isDisabledItem && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => !isDisabledItem && onSelect(item.location_id)}
                                disabled={isDisabledItem}
                                title={isDisabledItem ? "Cannot select this location" : item.name}
                            >
                                {item.name}
                                {item.description && (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        ({item.description})
                                    </span>
                                )}
                            </Button>
                        </div>
                        {isExpanded && (
                            <div role="group">
                                {children}
                            </div>
                        )}
                    </div>
                );
            });
    };

    return (
        <div
            className={cn(
                "border rounded-md p-2",
                "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                className
            )}
        >
            <div className="space-y-2">
                <input
                    type="text"
                    className="w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "w-full justify-start",
                        selectedId === null && "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    )}
                    onClick={() => onSelect(null)}
                    disabled={disabled}
                >
                    No Parent
                </Button>
            </div>
            <div
                className="mt-2 max-h-48 overflow-y-auto"
                role="tree"
            >
                {buildTree()}
                {filteredItems.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                        No locations found
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeSelect;