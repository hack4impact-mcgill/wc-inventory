import { Category } from "@/types/category";


export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
  isExpanded?: boolean;
}

export const matchesFilter = (category: CategoryWithChildren, filter: string): boolean => {
    const directMatch =
      category.name.toLowerCase().includes(filter.toLowerCase()) ||
      (category.description?.toLowerCase() ?? "").includes(filter.toLowerCase());

    if (category.children && category.children.length > 0) {
      return directMatch || category.children.some((child) => matchesFilter(child, filter));
    }

    return directMatch;
  };

  export const buildHierarchy = (categories: Category[]): CategoryWithChildren[] => {
    const categoryMap = new Map<string, CategoryWithChildren>();
    const roots: CategoryWithChildren[] = [];

    categories.forEach((category) => {
      categoryMap.set(category.category_id, { ...category, children: [] });
    });

    categories.forEach((category) => {
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