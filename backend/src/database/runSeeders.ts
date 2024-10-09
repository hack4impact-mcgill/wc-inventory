import { AppDataSource } from "./database";
import { createAdminUser } from "./seeders/createAdminUser";
import { dropDatabase } from "./seeders/dropDatabase";
import { seedCategories } from "./seeders/seedCategories";

async function runSeeders() {
  await AppDataSource.initialize();

  try {
    if (process.argv.includes("--drop")) {
      await dropDatabase();
    } else {
      await createAdminUser();
      await seedCategories();
    }
    console.log("All seeders ran successfully!");

  } catch (error) {
    console.error("Error running seeders:", error);
  }
  await AppDataSource.destroy();
}

runSeeders().catch((error) => {
  console.error("Error running seeders:", error);
  process.exit(1);
});

