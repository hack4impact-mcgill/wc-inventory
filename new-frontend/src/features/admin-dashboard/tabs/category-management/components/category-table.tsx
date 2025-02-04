import {type FC, useEffect, useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";
import type { Database } from "@/types/supabase";
import { getCategoryIcon } from "@/types/icons";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriesTableProps {
  data: Category[] | undefined;
  filter: string;
  onEdit?: (categoryId: string) => (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  isExpanded?: boolean;
}

const CategoriesTable: FC<CategoriesTableProps> = ({
                                                     data = [],
                                                     filter = "",
                                                     onEdit,
                                                     onDelete,
                                                   }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Helper function to check if a category or its children match the filter
  const matchesFilter = (category: CategoryWithChildren): boolean => {
    const directMatch =
        category.name.toLowerCase().includes(filter.toLowerCase()) ||
        (category.description?.toLowerCase() ?? "").includes(filter.toLowerCase());

    // Check children recursively
    if (category.children && category.children.length > 0) {
      return directMatch || category.children.some(child => matchesFilter(child));
    }

    return directMatch;
  };

  // Convert flat array to hierarchical structure
  const buildHierarchy = (categories: Category[]): CategoryWithChildren[] => {
    const categoryMap = new Map<string, CategoryWithChildren>();
    const roots: CategoryWithChildren[] = [];

    categories.forEach(category => {
      categoryMap.set(category.category_id, { ...category, children: [] });
    });

    categories.forEach(category => {
      const node = categoryMap.get(category.category_id)!;
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children?.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // Move expansion logic to useEffect
  useEffect(() => {
    if (filter) {
      const categoryMap = new Map<string, CategoryWithChildren>();
      data.forEach(category => {
        categoryMap.set(category.category_id, { ...category, children: [] });
      });

      const toExpand = new Set<string>();
      data.forEach(category => {
        if (matchesFilter({ ...category, children: [] })) {
          let currentId = category.parent_id;
          while (currentId) {
            toExpand.add(currentId);
            const parent = categoryMap.get(currentId);
            currentId = parent?.parent_id || null;
          }
        }
      });

      setExpandedCategories(toExpand);
    } else {
      setExpandedCategories(new Set());
    }
  }, [filter, data]);

  const hierarchicalCategories = buildHierarchy(data);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderCategoryRow = (category: CategoryWithChildren, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.category_id);
    const IconComponent = getCategoryIcon(category.icon);

    // Skip this category and its children if they don't match the filter
    if (filter && !matchesFilter(category)) {
      return null;
    }


    return (
        <>
          <TableRow key={category.category_id}>
            <TableCell className="pl-4">
              {hasChildren && (
                  <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-6 w-6"
                      onClick={() => toggleExpand(category.category_id)}
                  >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
              )}
            </TableCell>
            <TableCell>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </TableCell>
            <TableCell className="font-medium">
              <div style={{ marginLeft: `${level * 16}px` }}>
                {category.name}
              </div>
            </TableCell>
            <TableCell>{category.description || "-"}</TableCell>
            <TableCell>{category.level}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(category.category_id)(category)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete?.(category.category_id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          {hasChildren &&
              (isExpanded || filter) &&
              category.children?.map(child => renderCategoryRow(child, level + 1))}
        </>
    );
  };

  return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="w-[50px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="w-[70px]">Options</TableHead>  {}
            </TableRow>
          </TableHeader>
          <TableBody>
            {hierarchicalCategories.length === 0 ? (
                <TableRow>
                  <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground h-24"
                  >
                    No categories found
                  </TableCell>
                </TableRow>
            ) : (
                hierarchicalCategories.map(category => renderCategoryRow(category))
            )}
          </TableBody>
        </Table>
      </div>
  );
};

export default CategoriesTable;
