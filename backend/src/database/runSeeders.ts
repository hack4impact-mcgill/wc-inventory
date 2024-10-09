import { AppDataSource } from "./database";
import { createUsers } from "./seeders/createUsers";
import { dropDatabase } from "./seeders/dropDatabase";

async function runSeeders() {
  await AppDataSource.initialize();

  if (process.argv.includes("--drop")) {
    await dropDatabase();
  } else {
    await createUsers();
  }
  
  await AppDataSource.destroy();
}

runSeeders().catch((error) => {
  console.error("Error running seeders:", error);
  process.exit(1);
});

