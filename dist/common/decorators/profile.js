"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const common_1 = require("@nestjs/common");
exports.Profile = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=profile.js.map