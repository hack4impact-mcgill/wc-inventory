import { AppDataSource } from "../database";

export async function dropDatabase() {
  await AppDataSource.dropDatabase();
  console.log("Database dropped successfully");
}
