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

    async getUserById(id: string): Promise<UserDTO | null> {
        if (!isValidUUID(id)) {
            throw new ValidateError(
                {
                    id: { message: "Invalid UUID", value: id }
                },
                "Invalid UUID format"
            );
        }
        const user = await this.userRepository.findOneBy({ id });
        return user ? plainToInstance(UserDTO, user, { excludeExtraneousValues: true }) : null;
    }


    async getUserByIdPublic(id: string): Promise<User> {
        if (!isValidUUID(id)) {
            throw new ValidateError(
                {
                    id: { message: "Invalid UUID", value: id }
                },
                "Invalid UUID format"
            );
        }
        const user = await this.userRepository.findOneBy({ id });
        if (! user) {
            throw new NotFoundError("User not found");
        }
        return user;
    }

    async getUserByUsername(username: string): Promise<UserDTO | null> {
        const user = await this.userRepository.findOneBy({ username });
        return user ? plainToInstance(UserDTO, user, { excludeExtraneousValues: true }) : null;
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
