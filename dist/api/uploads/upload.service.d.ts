import { PaginationModel } from 'src/common/models/pagination.model';
import { Upload } from 'src/entities/upload.entity';
import { MediaService } from 'src/services/media/media.service';
import { Repository } from 'typeorm';
export declare class UploadService {
    private readonly uploadRepo;
    private readonly mediaService;
    private readonly defaultFolder;
    private readonly defaultTags;
    constructor(uploadRepo: Repository<Upload>, mediaService: MediaService);
    uploadFile(file: Buffer): Promise<Upload>;
    uploadManyFiles(files: Buffer[]): Promise<Upload[]>;
    deleteFile(id: number): Promise<Upload>;
    findById(id: number): Promise<Upload>;
    findBy(params: {
        page: number;
        size: number;
    }): Promise<PaginationModel<Upload>>;
}
