import { v4 } from "uuid";
import { Location } from "../entities/location.entity";
import { AppDataSource } from "./database";
import { createAdminUser } from "./seeders/createAdminUser";
import { dropDatabase } from "./seeders/dropDatabase";

async function runSeeders() {
  await AppDataSource.initialize();

  if (process.argv.includes("--drop")) {
    await dropDatabase();
  } else {
    await createAdminUser();
    await createLocations();
  }



  await AppDataSource.destroy();
}

runSeeders().catch((error) => {
  console.error("Error running seeders:", error);
  process.exit(1);
});


async function createLocations() {
  const locationRep = AppDataSource.getRepository(Location);
  const location1 = locationRep.create({
    location_id: v4(),
    name: "Location 1",
    description: "Location 1 Description"
  });
  await locationRep.save(location1);
  const location2 = locationRep.create({
    location_id: v4(),
    name: "Location 2",
    description: "Location 2 Description",
    parentLocation: location1
  });
  await locationRep.save(location2);

}
