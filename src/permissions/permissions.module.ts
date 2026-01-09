import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionsSeeder } from './permissions.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), DiscoveryModule],
  providers: [PermissionsService, PermissionsSeeder],
  controllers: [PermissionsController],
  exports: [PermissionsService]
})
export class PermissionsModule { }
