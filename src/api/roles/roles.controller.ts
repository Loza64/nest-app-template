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
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';
import { PaginationModel } from 'src/common/models/pagination-model';
import { FindOptionsRelations } from 'typeorm';
import { CreateRoleDto } from './dto/role-create.dto';
import { UpdateRoleDto } from './dto/role-update.dto';

@Controller('api/roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    async findBy(@Query() query: Record<string, string>): Promise<PaginationModel<Role>> {
        const { page = '1', size = '50' } = query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(size, 10);

        return this.rolesService.findBy({
            filters: {},
            relations: {},
            page: pageNumber,
            size: pageSize,
        });
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('populate') populate?: string,
    ): Promise<Role> {
        let relations: FindOptionsRelations<Role> | undefined = undefined;

        if (populate) {
            try {
                relations = JSON.parse(populate) as FindOptionsRelations<Role>;
            } catch {
                throw new Error('Invalid populate JSON');
            }
        }

        return this.rolesService.findOneBy({ filters: { id }, relations });
    }

    @Post()
    async create(@Body() dto: CreateRoleDto): Promise<Role> {
        return this.rolesService.create(dto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoleDto,
    ): Promise<Role> {
        return this.rolesService.update({ id, dto });
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Role> {
        return this.rolesService.delete(id);
    }
}
