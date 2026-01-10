"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationModel = void 0;
class PaginationModel {
    data;
    page;
    pageSize;
    pageCount;
    total;
    constructor(data, page, pageSize, pageCount, total) {
        this.data = data;
        this.page = page;
        this.pageSize = pageSize;
        this.pageCount = pageCount;
        this.total = total;
    }
}
exports.PaginationModel = PaginationModel;
//# sourceMappingURL=pagination.model.js.map