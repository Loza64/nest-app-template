export class PaginationModel<T> {
    constructor(
        public readonly data: T[],
        public readonly page: number,
        public readonly size: number,
        public readonly pages: number,
        public readonly total: number,
    ) { }
}