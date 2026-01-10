import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';
import { PaginationModel } from 'src/common/models/pagination.model';
import { CreateRoleDto } from './dto/role-create.dto';
import { UpdateRoleDto } from './dto/role-update.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findBy(query: Record<string, string>): Promise<PaginationModel<Role>>;
    findOne(id: number, populate?: string): Promise<Role>;
    create(dto: CreateRoleDto): Promise<Role>;
    update(id: number, dto: UpdateRoleDto): Promise<Role>;
    delete(id: number): Promise<Role>;
}
