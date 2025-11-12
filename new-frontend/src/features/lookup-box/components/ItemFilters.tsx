import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { Category } from "@/types/category";
import { Size } from "@/types/size.ts";

interface ItemFiltersProps {
  categories?: Category[];
  sizes?: Size[];
  selectedCategoryId: string;
  selectedSizeId: string;
  selectedGender: string;
  selectedStatus: string;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const ItemFilters = ({
  categories,
  sizes,
  selectedCategoryId,
  selectedSizeId,
  selectedGender,
  selectedStatus,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  onStatusChange,
}: ItemFiltersProps) => {
  const genders = ["Male", "Female", "Unisex", "Kids"];
  const activeItems = selectedStatus === "Active";

  const SHOE_CATEGORY_ID = "f9998911-97c2-43fb-86ef-b63162758a55";
  const SHOE_SIZES_IDS = sizes?.filter((size) => size.category === "Shoe").map((x) => x.size_id);
  // size.gender does not have "Kid", has "Unisex" instead
  const KID_SIZES_IDS = sizes?.filter((size) => size.category === "Kid").map((x) => x.size_id);
  // both size.category does not have "Female" or "Male", "Adult" instead
  const MALE_SIZES_IDS = sizes?.filter((size) => size.gender === "Male").map((x) => x.size_id);
  const FEMALE_SIZES_IDS = sizes?.filter((size) => size.gender === "Female").map((x) => x.size_id);

  const filteredSizes = useMemo(() => 
    sizes?.filter(
      (size) =>
          (selectedCategoryId === SHOE_CATEGORY_ID
            ? size.category === "Shoe"
            : selectedCategoryId !== "all"
              ? size.category !== "Shoe"
              : true
          )
          &&
          (selectedGender === "Male"
            ? size.gender === "Male"
            : (selectedGender === "Unisex" || selectedGender === "Kids")
              ? size.gender === "Unisex"
              : selectedGender === "Female"
                ? size.gender === "Female"
                : true
          )
    ),
    [sizes, selectedCategoryId, selectedGender]
  );

  const filteredCategories = useMemo(() =>
    SHOE_SIZES_IDS?.includes(selectedSizeId)
      ? categories?.filter((category) => category.name === "Shoes")
      : selectedSizeId !== "all"
        ? categories?.filter((category) => category.name !== "Shoes")
        : categories,
    [categories, selectedSizeId, SHOE_SIZES_IDS]
  );

  const filteredGenders = useMemo(() =>
    MALE_SIZES_IDS?.includes(selectedSizeId)
      ? genders?.filter((gender) => gender === "Male")
      : FEMALE_SIZES_IDS?.includes(selectedSizeId)
        ? genders?.filter((gender) => gender === "Female")
        : KID_SIZES_IDS?.includes(selectedSizeId)
          ? genders?.filter((gender) => (gender === "Unisex" || gender === "Kids"))
          : genders,
    [genders, selectedSizeId, MALE_SIZES_IDS, FEMALE_SIZES_IDS, KID_SIZES_IDS]
  );

  return (

    <>

      <button
        className="ml-1 flex-1 h-14 flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-lg w-11/12"
        onClick={() => onStatusChange(activeItems ? "Donated" : "Active")}
      >
        <p className="text-3xl">
          {activeItems ? "Active" : "Donated"}
        </p>
      </button>

      <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
        <SelectTrigger 
          className="ml-1 flex-1 flex items-center justify-center gap-5 w-11/12 border-2 p-4 rounded-lg 
            text-3xl [&>svg]:h-8 [&>svg]:w-8"
        >
          <SelectValue placeholder="Category"/>
        </SelectTrigger>

        <SelectContent>
          <SelectItem className="text-2xl text-black" value="all">
            All Items
          </SelectItem>
          {filteredCategories?.map((c) => (
            <SelectItem className="text-2xl text-black" key={c.category_id} value={c.category_id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger 
          className="ml-1 flex-1 flex items-center justify-center gap-5 w-11/12 border-2 p-4 rounded-lg 
            text-3xl [&>svg]:h-8 [&>svg]:w-8"
        >
          <SelectValue placeholder="Gender"/>
        </SelectTrigger>

        <SelectContent>
          <SelectItem className="text-2xl text-black" key="all" value="all">
            All Genders
          </SelectItem>
          {filteredGenders.map((g) => (
            <SelectItem className="text-2xl text-black" key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSizeId} onValueChange={onSizeChange}>
        <SelectTrigger 
          className="ml-1 flex-1 flex items-center justify-center gap-5 w-11/12 border-2 p-4 rounded-lg 
            text-3xl [&>svg]:h-8 [&>svg]:w-8"
        >
          <SelectValue placeholder="Size"/>
        </SelectTrigger>

        <SelectContent>
          <SelectItem className="text-2xl text-black" value="all">
            All Sizes
          </SelectItem>
          {filteredSizes?.map((s) => (
            <SelectItem className="text-2xl text-black" key={s.size_id} value={s.size_id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </>

  );

};

export default ItemFilters;
