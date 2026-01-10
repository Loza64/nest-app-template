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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const pagination_model_1 = require("../../common/models/pagination.model");
const user_entity_1 = require("../../entities/user.entity");
const role_entity_1 = require("../../entities/role.entity");
let UsersService = class UsersService {
    userRepo;
    roleRepo;
    constructor(userRepo, roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }
    async login(identifier) {
        const user = await this.userRepo.findOne({
            where: [
                { username: identifier, deletedAt: (0, typeorm_2.IsNull)() },
                { email: identifier, deletedAt: (0, typeorm_2.IsNull)() },
            ],
            relations: {
                role: true,
            },
        });
        return user;
    }
    async findAuth(id) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: {
                role: {
                    permissions: true,
                },
            },
        });
        return user;
    }
    async create(dto) {
        let role = null;
        if (dto.role?.id) {
            role = await this.roleRepo.findOne({ where: { id: dto.role.id } });
            if (!role)
                throw new common_1.NotFoundException('Role not found');
        }
        const user = this.userRepo.create({ ...dto, role });
        return this.userRepo.save(user);
    }
    async update({ id, dto, }) {
        const user = await this.findOneBy({ filters: { id } });
        Object.entries(dto).forEach(([key, value]) => {
            if (value !== undefined)
                user[key] = value;
        });
        if (dto.role?.id) {
            const roleEntity = await this.roleRepo.findOne({
                where: { id: dto.role.id },
            });
            if (!roleEntity)
                throw new common_1.NotFoundException('Role not found');
            user.role = roleEntity;
        }
        return this.userRepo.save(user);
    }
    async delete(id) {
        const user = await this.findOneBy({ filters: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.userRepo.remove(user);
        return user;
    }
    async softDelete(id) {
        const user = await this.findOneBy({ filters: { id } });
        user.deletedAt = new Date();
        return this.userRepo.save(user);
    }
    async restore(id) {
        const user = await this.findOneBy({ filters: { id } });
        user.deletedAt = null;
        return this.userRepo.save(user);
    }
    async findOneBy(params) {
        const user = await this.userRepo.findOne({
            where: params.filters,
            relations: params.relations,
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findBy(params) {
        const result = await (0, nestjs_typeorm_paginate_1.paginate)(this.userRepo, { page: params.page, limit: params.size }, { where: params.filters, relations: params.relations });
        return new pagination_model_1.PaginationModel(result.items, result.meta.currentPage, result.meta.itemsPerPage, result.meta.totalPages ?? 1, result.meta.totalItems ?? 0);
    }
    async count(filters) {
        return this.userRepo.count({ where: filters });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map