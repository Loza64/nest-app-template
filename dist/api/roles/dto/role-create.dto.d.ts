declare class PermissionIdDto {
    id: number;
}
export declare class CreateRoleDto {
    name: string;
    permissions?: PermissionIdDto[];
}
export {};
