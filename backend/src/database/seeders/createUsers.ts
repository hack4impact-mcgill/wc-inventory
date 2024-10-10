import { AppDataSource } from "../database";
import { User, UserRole } from "../../entities/user.entity";

export async function createUsers() {
  const userRepository = AppDataSource.getRepository(User);
  
  const adminUser = userRepository.create({
    username: "admin", 
    password: "admin123", 
    role: UserRole.Admin,
    email: "admin@example.com",
  });

  const user = userRepository.create({
    username: "user",
    password: "user123",
    role: UserRole.Volunteer,
    email: "user@example.com",
  });

  await userRepository.save([adminUser, user]);

  console.log("Admin user created successfully");
}
