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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const pagination_model_1 = require("../../common/models/pagination.model");
const upload_entity_1 = require("../../entities/upload.entity");
const media_service_1 = require("../../services/media/media.service");
const typeorm_2 = require("typeorm");
let UploadService = class UploadService {
    uploadRepo;
    mediaService;
    defaultFolder = 'nestjs';
    defaultTags = ['nestjs-upload'];
    constructor(uploadRepo, mediaService) {
        this.uploadRepo = uploadRepo;
        this.mediaService = mediaService;
    }
    async uploadFile(file) {
        if (!file || file.length === 0) {
            throw new common_1.BadRequestException('File is empty');
        }
        const result = await this.mediaService.upload(file, {
            folder: this.defaultFolder,
            tags: this.defaultTags,
        });
        const upload = this.uploadRepo.create({
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            resourceType: result.resource_type,
            format: result.format,
            originalFilename: result.original_filename,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            tags: result.tags,
            placeholder: result.placeholder,
        });
        return this.uploadRepo.save(upload);
    }
    async uploadManyFiles(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploads = [];
        for (const file of files) {
            const upload = await this.uploadFile(file);
            uploads.push(upload);
        }
        return uploads;
    }
    async deleteFile(id) {
        if (!id) {
            throw new common_1.BadRequestException('id is required');
        }
        const upload = await this.uploadRepo.findOne({ where: { id } });
        if (!upload) {
            throw new common_1.NotFoundException(`File with id ${id} not found`);
        }
        await this.mediaService.destroy(upload.publicId);
        return await this.uploadRepo.remove(upload);
    }
    async findById(id) {
        const upload = await this.uploadRepo.findOne({ where: { id } });
        if (!upload) {
            throw new common_1.NotFoundException(`File with id ${id} not found`);
        }
        return upload;
    }
    async findBy(params) {
        const result = await (0, nestjs_typeorm_paginate_1.paginate)(this.uploadRepo, { page: params.page, limit: params.size });
        return new pagination_model_1.PaginationModel(result.items, result.meta.currentPage, result.meta.itemsPerPage, result.meta.totalPages ?? 1, result.meta.totalItems ?? 0);
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        media_service_1.MediaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map