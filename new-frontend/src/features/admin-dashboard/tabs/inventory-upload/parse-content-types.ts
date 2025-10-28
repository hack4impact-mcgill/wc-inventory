import { Size } from "@/types/size";

export interface ContentTypeResponse {
  types: Set<string>;
  sizes: Set<Size>;
}

export default function parseContentTypes(contentTypes: string[]) {

  const types = new Set<string>();
  const sizes = new Set<Size>();

  // read through each content type
  for (const type of contentTypes) {

    // skip empty types
    if (!type) continue;

    const [ _, itemType, genderStr, sizeStr ] = type.split("\n");
    types.add(itemType);

    let category: "Other" | "Adult" | "Kid" | "Shoe" | "baby" = "Other";

    if (itemType == "Bottes") category = "Shoe";
    else if (genderStr == "Homme" || genderStr == "Femme" || genderStr == "Adultes") category = "Adult";
    else if (genderStr == "Garçon" || genderStr == "Fille") category = "Kid";
    else if (genderStr == "Bébé") category = "baby";

    let gender : "Male" | "Female" | "Unisex" | "Kids" = "Unisex";

    if (genderStr == "Homme") gender = "Male";
    else if (genderStr == "Femme") gender = "Female";
    else if (genderStr == "Garçon" || genderStr == "Fille" || genderStr == "Bébé") gender = "Kids"; 

    const size: Size = {
      name: sizeStr,
      gender: gender,
      region: "US",
      size_id: "0",
      category,
      created_at: null, is_numerical: null, numerical_value: null, updated_at: null
    }

    sizes.add(size);

  }

  return { types, sizes };

}