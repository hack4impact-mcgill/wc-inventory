import { AppDataSource } from "../database";
import { User, UserRole } from "../../entities/user.entity";

export async function createAdminUser() {
  const userRepository = AppDataSource.getRepository(User);
  
  const adminUser = userRepository.create({
    username: "admin",
    password: "admin123", 
    role: UserRole.Admin,
    email: "admin@example.com",
  });

  await userRepository.save(adminUser);

  console.log("Admin user created successfully");
}
