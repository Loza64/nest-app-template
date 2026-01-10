import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from '@scwar/nestjs-cloudinary';
import { MediaService } from './media.service';

@Module({
  imports: [
    ConfigModule,
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
        api_key: config.get<string>('CLOUDINARY_API_KEY'),
        api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
        secure: true,
      }),
    }),
  ],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
