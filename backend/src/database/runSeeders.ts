import { AppDataSource } from "./database";
import { createUsers } from "./seeders/createUsers";
import { dropDatabase } from "./seeders/dropDatabase";
import { seedCategories } from "./seeders/seedCategories";

async function runSeeders() {
  await AppDataSource.initialize();

  try {
    if (process.argv.includes("--drop")) {
      await dropDatabase();
    } else {
      await createUsers();
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

