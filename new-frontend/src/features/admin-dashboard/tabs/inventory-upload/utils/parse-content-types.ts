import { Size } from "@/types/size";

export interface ContentTypeResponse {
  types: Set<string>;
  sizes: Set<Size>;
  typeMap: StringToTypes;
}

export interface StringToTypes {
  [key: string]: {
    type: string;
    size: Size;
  };
}

export default function parseContentTypes(contentTypes: string[]) {

  const types = new Set<string>();
  const sizes = new Set<Size>();

  const typeMap: StringToTypes = {};

  // read through each content type
  for (const type of contentTypes) {

    // skip empty types
    if (!type) continue;
    // skip types that contain total
    if (type == undefined || type?.includes("Entry_") || type?.includes("Total")) continue;

    let [ _, itemType, genderStr, sizeStr ] = type.split("\n");

    // check to make sure the components are set properly
    if (itemType == "Accessoires") {
      itemType = sizeStr;
      sizeStr = "Adult";
    } else if (genderStr == "Accessoires") {
      genderStr = "Enfant";
      itemType = sizeStr;
      sizeStr = "Kids";
    } else if (itemType == "Fille") {
      itemType = genderStr;
      genderStr = "Fille";
    } else if (itemType == "Garçon") {
      itemType = genderStr;
      genderStr = "Garçon";
    }

    types.add(itemType);

    let category: "Other" | "Adult" | "Kid" | "Shoe" | "baby" = "Other";

    if (itemType == "Bottes") category = "Shoe";
    else if (genderStr == "Homme" || genderStr == "Femme" || genderStr == "Adultes") category = "Adult";
    else if (genderStr == "Garçon" || genderStr == "Fille" || genderStr == "Enfant" || genderStr == "Jeunesse") category = "Kid";
    else if (genderStr == "Bébé") category = "baby";

    let gender : "Male" | "Female" | "Unisex" | "Kids" = "Unisex";

    if (genderStr == "Homme" || genderStr == "Garçon") gender = "Male";
    else if (genderStr == "Femme" || genderStr == "Fille") gender = "Female";
    else if (genderStr == "Bébé" || genderStr == "Enfant") gender = "Unisex"; 

    const size: Size = {
      name: sizeStr,
      gender: gender,
      region: "US",
      size_id: sizeStr + "-" + gender,
      category,
      created_at: null, is_numerical: null, numerical_value: null, updated_at: null
    }

    sizes.add(size);

    typeMap[type] = {
      type: itemType,
      size: size
    };

  }

  return { types, sizes, typeMap };

}