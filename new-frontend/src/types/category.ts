//Categories.ts
import { Database } from "./supabase";

type CategoryTable = Database["public"]["Tables"]["categories"];

export type Category = CategoryTable["Row"];

export type CategoryInsert = CategoryTable["Insert"];

export type CategoryUpdate = CategoryTable["Update"];

export type CategoryFormData = Omit<Category, "category_id">; // type used for form submission

export interface CategoryFormProps {
    categories: Category[];
    onSubmit: (data: CategoryFormData) => Promise<void>;
    initialData?: Category | null;
    isLoading: boolean;
    onClose: () => void;
}