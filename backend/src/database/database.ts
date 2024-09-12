import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { configDotenv } from "dotenv";
configDotenv();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
    console.log(
      "Connected entities:",
      AppDataSource.entityMetadatas.map((metadata) => metadata.name).join(", "),
    );
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};
