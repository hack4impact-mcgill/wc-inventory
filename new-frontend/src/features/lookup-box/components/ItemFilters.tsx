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

    <div className="h-full w-full flex flex-col justify-center">

      <div className="h-[45vh] flex flex-col justify-start gap-6">

        <button
          className="w-[92%] h-14 mx-auto flex items-center justify-center border-2 border-gray-200 
                    rounded-lg text-xl font-medium"
          onClick={() => onStatusChange(activeItems ? "Donated" : "Active")}
        >
          {activeItems ? "Active" : "Donated"}
        </button>

        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Items</SelectItem>
            {filteredCategories?.map(c => (
              <SelectItem className="text-lg text-black" key={c.category_id} value={c.category_id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={onGenderChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Genders</SelectItem>
            {filteredGenders.map(g => (
              <SelectItem className="text-lg text-black" key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSizeId} onValueChange={onSizeChange}>
          <SelectTrigger
            className="w-[92%] h-14 mx-auto flex items-center justify-between border-2 
                      rounded-lg text-xl px-4 [&>svg]:h-6 [&>svg]:w-6"
          >
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-lg text-black" value="all">All Sizes</SelectItem>
            {filteredSizes?.map(s => (
              <SelectItem className="text-lg text-black" key={s.size_id} value={s.size_id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

    </div>

  );

};

export default ItemFilters;
