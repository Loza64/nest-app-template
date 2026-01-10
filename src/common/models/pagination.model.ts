export class PaginationModel<T> {
  constructor(
    public readonly data: T[],
    public readonly page: number,
    public readonly pageSize: number,
    public readonly pageCount: number,
    public readonly total: number,
  ) {}
}
