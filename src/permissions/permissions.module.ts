import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), DiscoveryModule],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService]
})
export class PermissionsModule { }
