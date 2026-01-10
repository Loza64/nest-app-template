import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MediaModule } from 'src/services/media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from 'src/entities/upload.entity';

@Module({
  imports: [MediaModule, TypeOrmModule.forFeature([Upload])],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService]
})
export class UploadModule { }
