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
import { PaginationModel } from 'src/common/models/pagination-model';
import { parsePopulate } from 'src/common/parse/populate.parse';
import filtersParse from 'src/common/parse/filters.parse';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findBy(@Query() query: Record<string, string>): Promise<PaginationModel<User>> {
        const { page = '1', size = '50' } = query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        const relations = parsePopulate<User>(query)
        const filters = filtersParse<User>({ query })

        return this.usersService.findBy({
            filters,
            relations,
            page: pageNumber,
            size: pageSize,
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Query() query: Record<string, string>): Promise<User> {
        const relations = parsePopulate<User>(query)
        return this.usersService.findOneBy({
            filters: { id },
            relations,
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
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.delete({ id });
    }
}
