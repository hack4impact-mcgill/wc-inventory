import { UserResponseDTO, CreateUserDTO, UserDTO } from "../dtos/user.dto";
import { AppDataSource } from "../database/database";
import { User } from "../entities/user.entity";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";
import { DuplicateError, NotFoundError } from "../utils/errors.util";
import { validate as isValidUUID } from "uuid";
import { ValidateError } from "tsoa";

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) { throw new NotFoundError("User not found"); }

        return user;
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ username });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user;
    }

    async createUser(createUserDto: CreateUserDTO): Promise<User> {
        const userExists = await this.getUserByUsername(createUserDto.username);
        if (userExists) {
            throw new DuplicateError("User already exists");
        }
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
        return user;
    }

    //TODO -  Delete User
}
