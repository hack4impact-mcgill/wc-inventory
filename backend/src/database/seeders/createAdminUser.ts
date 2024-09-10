import { AppDataSource } from "../database";
import { User, UserRole } from "../../entities/user.entity";

export async function createAdminUser() {
  const userRepository = AppDataSource.getRepository(User);

  const adminUser = new User();
  adminUser.username = "admin";
  adminUser.password = "admin123"; // Change this password!
  adminUser.role = UserRole.Admin;
  adminUser.email = "admin@example.com";
  await userRepository.save(adminUser);

  console.log("Admin user created successfully");
}
