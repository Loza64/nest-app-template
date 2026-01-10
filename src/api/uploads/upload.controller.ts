import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Get,
    Query,
    Param,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Upload } from 'src/entities/upload.entity';
import { PaginationModel } from 'src/common/models/pagination.model';
import { UploadService } from './upload.service';

@Controller('api/uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post()
    @UseInterceptors(FileInterceptor('files', { storage: memoryStorage() }))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Upload> {
        if (!file) throw new BadRequestException('No file uploaded');

        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'video/mp4',
            'video/mpeg',
            'video/quicktime',
            'video/webm',
            'video/ogg',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                'Invalid file type. Only images and videos are allowed.',
            );
        }

        return this.uploadService.uploadFile(file.buffer);
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: number): Promise<Upload> {
        return this.uploadService.deleteFile(id);
    }

    @Get(':id')
    async findById(@Param('id') id: number): Promise<Upload> {
        return this.uploadService.findById(id);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('size') size = 10,
    ): Promise<PaginationModel<Upload>> {
        return this.uploadService.findBy({ page: Number(page), size: Number(size) });
    }
}
