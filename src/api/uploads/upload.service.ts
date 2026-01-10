import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PaginationModel } from 'src/common/models/pagination.model';
import { Upload } from 'src/entities/upload.entity';
import { MediaService } from 'src/services/media/media.service';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {
    private readonly defaultFolder = 'nestjs';
    private readonly defaultTags = ['nestjs-upload'];

    constructor(
        @InjectRepository(Upload) private readonly uploadRepo: Repository<Upload>,
        private readonly mediaService: MediaService,
    ) { }

    async uploadFile(file: Buffer): Promise<Upload> {
        if (!file || file.length === 0) {
            throw new BadRequestException('File is empty');
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

    async uploadManyFiles(files: Buffer[]): Promise<Upload[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        const uploads: Upload[] = [];
        for (const file of files) {
            const upload = await this.uploadFile(file);
            uploads.push(upload);
        }

        return uploads;
    }

    async deleteFile(id: number): Promise<Upload> {
        if (!id) {
            throw new BadRequestException('id is required');
        }

        const upload = await this.uploadRepo.findOne({ where: { id } });
        if (!upload) {
            throw new NotFoundException(`File with id ${id} not found`);
        }

        await this.mediaService.destroy(upload.publicId);
        return await this.uploadRepo.remove(upload);
    }

    async findById(id: number): Promise<Upload> {
        const upload = await this.uploadRepo.findOne({ where: { id } });
        if (!upload) {
            throw new NotFoundException(`File with id ${id} not found`);
        }
        return upload;
    }

    async findBy(params: {
        page: number;
        size: number;
    }): Promise<PaginationModel<Upload>> {
        const result = await paginate<Upload>(
            this.uploadRepo,
            { page: params.page, limit: params.size },
        );
        return new PaginationModel<Upload>(
            result.items,
            result.meta.currentPage,
            result.meta.itemsPerPage,
            result.meta.totalPages ?? 1,
            result.meta.totalItems ?? 0,
        );
    }
}
