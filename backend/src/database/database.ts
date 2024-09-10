import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "nicklasastorian",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "welcome-collective",
  entities: [User],
  synchronize: true,
  // logging: true
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
