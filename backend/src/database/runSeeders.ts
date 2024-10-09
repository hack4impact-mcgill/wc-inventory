import { AppDataSource } from "./database";
import { createAdminUser } from "./seeders/createAdminUser";
import { dropDatabase } from "./seeders/dropDatabase";

async function runSeeders() {
  await AppDataSource.initialize();

  if (process.argv.includes("--drop")) {
    await dropDatabase();
  } else {
    await createAdminUser();
  }



  await AppDataSource.destroy();
}

runSeeders().catch((error) => {
  console.error("Error running seeders:", error);
  process.exit(1);
});

