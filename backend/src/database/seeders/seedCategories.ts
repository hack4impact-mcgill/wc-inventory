import { AppDataSource } from "../database";
import { Category } from "../../entities/category.entity";

export const seedCategories = async () => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = [
      {
        name: "Electronics",
        parentCategoryId: null,
      },
      {
        name: "Coats",
        parentCategoryId: null,
      },
      {
        name: "Boots",
        parentCategoryId: null,
      },
      {
        name: "Furniture",
        parentCategoryId: null,
      },
      {
        name: "Pants",
        parentCategoryId: null,
      },
      {
        name: "Chairs",
        parentCategoryId: null,
      },
    ];

    await categoryRepository.save(categories);

    console.log("Category table seeded successfully!");
  } catch (error) {
    console.error("Error seeding category table:", error);
  }
};

seedCategories();
