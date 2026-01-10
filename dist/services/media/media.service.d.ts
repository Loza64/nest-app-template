import { CloudinaryService } from '@scwar/nestjs-cloudinary';
export declare class MediaService {
    private readonly cloudinary;
    constructor(cloudinary: CloudinaryService);
    upload(filePath: Buffer, config: {
        folder: string;
        tags: string[];
    }): Promise<import("@scwar/nestjs-cloudinary").CloudinaryUploadResponse>;
    destroy(public_id: string): Promise<import("@scwar/nestjs-cloudinary").CloudinaryDeleteResponse>;
}
