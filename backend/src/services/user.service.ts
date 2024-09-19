import { UserResponseDTO, CreateUserDTO } from "../dtos/user.dto";
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

    private mapToUserResponseDTO(user: User): UserResponseDTO {
        return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
    }

    async getUsers(): Promise<UserResponseDTO[]> {
        const users = await this.userRepository.find();
        return users.map(this.mapToUserResponseDTO);
    }

    async getUserById(id: string): Promise<UserResponseDTO> {
        if (!isValidUUID(id)) {
            throw new ValidateError(
                {
                    id: { message: "Invalid UUID", value: id }
                },
                "Invalid UUID format"
            );
        }
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundError("User not found");
        }
        return this.mapToUserResponseDTO(user);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }

    async createUser(createUserDto: CreateUserDTO): Promise<UserResponseDTO> {
        const userExists = await this.getUserByUsername(createUserDto.username);
        if (userExists) {
            throw new DuplicateError("User already exists");
        }
        const user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
        return this.mapToUserResponseDTO(user);
    }

    //TODO -  Delete User
}
