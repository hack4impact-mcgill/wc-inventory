import { AppDataSource } from "./database";
import { createAdminUser } from "./seeders/createAdminUser";
import { dropDatabase } from "./seeders/dropDatabase";
import { seedLocations } from "./seeders/seedLocation";

async function runSeeders() {
  await AppDataSource.initialize();

  if (process.argv.includes("--drop")) {
    await dropDatabase();
  } else {
    await createAdminUser();
    await seedLocations();
  }

  await AppDataSource.destroy();
}

runSeeders().catch((error) => {
  console.error("Error running seeders:", error);
  process.exit(1);
});
