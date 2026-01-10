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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_entity_1 = require("../../entities/user.entity");
const create_dto_1 = require("./dto/create.dto");
const update_dto_1 = require("./dto/update.dto");
const typeorm_1 = require("typeorm");
const findUsersQueryDto_dto_1 = require("./dto/findUsersQueryDto.dto");
const profile_1 = require("../../common/decorators/profile");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    preventSelfAction(id, profile) {
        if (id === profile.id)
            throw new common_1.ForbiddenException('Cannot perform this action on your profile');
    }
    async findAll(query) {
        const { page = 1, size = 20, search, blocked, role } = query;
        let filters;
        if (search) {
            filters = [
                { name: (0, typeorm_1.ILike)(`%${search}%`) },
                { email: (0, typeorm_1.ILike)(`%${search}%`) },
                { username: (0, typeorm_1.ILike)(`%${search}%`) },
            ];
            filters = filters.map((f) => ({
                ...f,
                ...(blocked !== undefined ? { blocked } : {}),
                ...(role ? { role: { id: role } } : {}),
            }));
        }
        else {
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
    async findOne(id) {
        return this.usersService.findOneBy({
            filters: { id },
            relations: {
                role: true,
            },
        });
    }
    async create(dto) {
        return this.usersService.create(dto);
    }
    async update(id, dto, profile) {
        this.preventSelfAction(id, profile);
        return this.usersService.update({ id, dto });
    }
    async delete(id, profile) {
        this.preventSelfAction(id, profile);
        return this.usersService.delete(id);
    }
    async softDelete(id, profile) {
        this.preventSelfAction(id, profile);
        return this.usersService.softDelete(id);
    }
    async restore(id, profile) {
        this.preventSelfAction(id, profile);
        return this.usersService.restore(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [findUsersQueryDto_dto_1.FindUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, profile_1.Profile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_dto_1.UpdateUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, profile_1.Profile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)(':id/soft'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, profile_1.Profile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Put)(':id/restore'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, profile_1.Profile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "restore", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map