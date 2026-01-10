export declare class PaginationModel<T> {
    readonly data: T[];
    readonly page: number;
    readonly pageSize: number;
    readonly pageCount: number;
    readonly total: number;
    constructor(data: T[], page: number, pageSize: number, pageCount: number, total: number);
}
