import { Upload } from 'src/entities/upload.entity';
import { PaginationModel } from 'src/common/models/pagination.model';
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<Upload>;
    deleteFile(id: number): Promise<Upload>;
    findById(id: number): Promise<Upload>;
    findAll(page?: number, size?: number): Promise<PaginationModel<Upload>>;
}
