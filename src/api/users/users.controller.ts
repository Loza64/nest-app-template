import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { FindOptionsWhere } from 'typeorm';
import { ILike } from 'typeorm';
import { FindUsersQueryDto } from './dto/findUsersQueryDto.dto';
import { Profile } from 'src/common/decorators/profile';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    private preventSelfAction(id: number, profile: User) {
        if (id === profile.id) throw new ForbiddenException('Cannot perform this action on your profile');
    }

    @Get()
    async findAll(@Query() query: FindUsersQueryDto) {
        const { page = 1, size = 20, search, blocked, role } = query;

        let filters: FindOptionsWhere<User> | FindOptionsWhere<User>[];

        if (search) {
            filters = [
                { name: ILike(`%${search}%`) },
                { email: ILike(`%${search}%`) },
                { username: ILike(`%${search}%`) },
            ];
            filters = filters.map(f => ({
                ...f,
                ...(blocked !== undefined ? { blocked } : {}),
                ...(role ? { role: { id: role } } : {}),
            }));
        } else {
            filters = {
                ...(blocked !== undefined ? { blocked } : {}),
                ...(role ? { role: { id: role } } : {}),
            };
        }

        return this.usersService.findBy({
            filters,
            relations: { role: true },
            page,
            size,
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOneBy({
            filters: { id },
            relations: {
                role: true
            },
        });
    }

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.create(dto);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Profile() profile: User): Promise<User> {
        this.preventSelfAction(id, profile);
        return this.usersService.update({ id, dto });
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Profile() profile: User): Promise<User> {
        this.preventSelfAction(id, profile);
        return this.usersService.delete(id);
    }

    @Delete(':id/soft')
    async softDelete(@Param('id', ParseIntPipe) id: number, @Profile() profile: User): Promise<User> {
        this.preventSelfAction(id, profile);
        return this.usersService.softDelete(id);
    }

    @Put(':id/restore')
    async restore(@Param('id', ParseIntPipe) id: number, @Profile() profile: User): Promise<User> {
        this.preventSelfAction(id, profile);
        return this.usersService.restore(id);
    }
}
