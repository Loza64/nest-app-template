import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@scwar/nestjs-cloudinary';

@Injectable()
export class MediaService {
  constructor(private readonly cloudinary: CloudinaryService) { }

  async upload(filePath: Buffer, config: { folder: string; tags: string[]; }) {
    return await this.cloudinary.upload(filePath, config);
  }

  async destroy(public_id: string) {
    return await this.cloudinary.delete(public_id);
  }
}
