import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { FindUsersQueryDto } from './dto/findUsersQueryDto.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    private preventSelfAction;
    findAll(query: FindUsersQueryDto): Promise<import("../../common/models/pagination.model").PaginationModel<User>>;
    findOne(id: number): Promise<User>;
    create(dto: CreateUserDto): Promise<User>;
    update(id: number, dto: UpdateUserDto, profile: User): Promise<User>;
    delete(id: number, profile: User): Promise<User>;
    softDelete(id: number, profile: User): Promise<User>;
    restore(id: number, profile: User): Promise<User>;
}
