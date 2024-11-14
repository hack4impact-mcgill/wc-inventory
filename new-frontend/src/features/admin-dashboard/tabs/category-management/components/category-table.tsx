import { type FC } from "react";
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
import { MoreHorizontal } from "lucide-react";
import type { Database } from "@/types/supabase";
import { getCategoryIcon } from "@/types/icons";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriesTableProps {
  data: Category[] | undefined;
  filter: string;
  onEdit?: (categoryId: string) => void;
  onDelete?: (categoryId: string) => void;
}

const CategoriesTable: FC<CategoriesTableProps> = ({
  data = [],
  filter = "",
  onEdit,
  onDelete,
}) => {
  // Filter categories based on search input
  const filteredCategories = data?.filter(
    (category) =>
      category.name.toLowerCase().includes(filter.toLowerCase()) ||
      (category.description?.toLowerCase() ?? "").includes(
        filter.toLowerCase(),
      ),
  );

  // Helper function to get parent category name
  const getParentName = (parentId: string | null): string => {
    if (!parentId) return "-";
    return data?.find((cat) => cat.category_id === parentId)?.name ?? "-";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!filteredCategories || filteredCategories.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground h-24"
              >
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            filteredCategories.map((category) => {
              const IconComponent = getCategoryIcon(category.icon);

              return (
                <TableRow key={category.category_id}>
                  <TableCell className="pl-4">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div style={{ marginLeft: `${category.level * 12}px` }}>
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell>{category.level}</TableCell>
                  <TableCell>{getParentName(category.parent_id)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit?.(category.category_id)}
                        >
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
