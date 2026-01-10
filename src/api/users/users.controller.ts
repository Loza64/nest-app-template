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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { FindOptionsWhere } from 'typeorm';
import { ILike } from 'typeorm';
import { FindUsersQueryDto } from './dto/findUsersQueryDto.dto';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

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
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<User> {
        return this.usersService.update({ id, dto });
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.delete(id);
    }
}
