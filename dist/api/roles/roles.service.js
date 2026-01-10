"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../../entities/role.entity");
const permission_entity_1 = require("../../entities/permission.entity");
const pagination_model_1 = require("../../common/models/pagination.model");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let RolesService = class RolesService {
    roleRepo;
    permRepo;
    constructor(roleRepo, permRepo) {
        this.roleRepo = roleRepo;
        this.permRepo = permRepo;
    }
    async create(dto) {
        let permissions = [];
        if (dto.permissions?.length) {
            const ids = dto.permissions.map((p) => p.id);
            permissions = await this.permRepo.findBy({ id: (0, typeorm_2.In)(ids) });
            if (permissions.length !== ids.length)
                throw new common_1.NotFoundException('Some permissions not found');
        }
        const role = this.roleRepo.create({ ...dto, permissions });
        return this.roleRepo.save(role);
    }
    async update({ id, dto, }) {
        const role = await this.roleRepo.findOne({
            where: { id },
            relations: ['permissions'],
        });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        Object.entries(dto).forEach(([key, value]) => {
            if (key !== 'permissions' && value !== undefined)
                role[key] = value ?? role[key];
        });
        if (dto.permissions) {
            const ids = dto.permissions.map((p) => p.id);
            const permissions = await this.permRepo.findBy({ id: (0, typeorm_2.In)(ids) });
            if (permissions.length !== ids.length)
                throw new common_1.NotFoundException('Some permissions not found');
            role.permissions = permissions;
        }
        return this.roleRepo.save(role);
    }
    async delete(id) {
        const role = await this.findOneBy({ filters: { id } });
        await this.roleRepo.remove(role);
        return role;
    }
    async softDelete(id) {
        const role = await this.findOneBy({ filters: { id } });
        role.deletedAt = new Date();
        return this.roleRepo.save(role);
    }
    async restore(id) {
        const role = await this.findOneBy({ filters: { id } });
        role.deletedAt = null;
        return this.roleRepo.save(role);
    }
    async findOneBy(params) {
        const role = await this.roleRepo.findOne({
            where: params.filters,
            relations: params.relations,
        });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        return role;
    }
    async findBy(params) {
        const result = await (0, nestjs_typeorm_paginate_1.paginate)(this.roleRepo, { page: params.page, limit: params.size }, { where: params.filters, relations: params.relations });
        return new pagination_model_1.PaginationModel(result.items, result.meta.currentPage, result.meta.itemsPerPage, result.meta.totalPages ?? 1, result.meta.totalItems ?? 0);
    }
    async count(filters) {
        return this.roleRepo.count({ where: filters });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map