import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PermissionCreateDto {
  @IsNotEmpty({ message: 'El path es obligatorio' })
  @IsString()
  path: string;

  @IsNotEmpty({ message: 'El método es obligatorio' })
  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  title?: string;
}
