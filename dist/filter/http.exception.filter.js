"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { status, message } = this.getStatusAndMessage(exception);
        response.status(status).json({ status, message });
    }
    getStatusAndMessage(exception) {
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            const message = this.extractMessage(this.isHttpResponseWithMessage(res)
                ? res
                : { message: this.stringifyResponse(res) });
            return { status, message };
        }
        if (this.isCloudinaryError(exception)) {
            const status = exception.http_code ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const message = exception.message ?? 'Internal server error';
            return { status, message };
        }
        return { status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, message: 'Internal server error' };
    }
    extractMessage(response) {
        const msg = response.message;
        if (Array.isArray(msg))
            return msg.join(', ');
        if (typeof msg === 'string')
            return msg;
        return JSON.stringify(response);
    }
    isCloudinaryError(exception) {
        return (typeof exception === 'object' && exception !== null && 'message' in exception && typeof exception.message === 'string');
    }
    isHttpResponseWithMessage(obj) {
        return typeof obj === 'object' && obj !== null && 'message' in obj;
    }
    stringifyResponse(res) {
        try {
            return typeof res === 'object' && res !== null ? JSON.stringify(res) : String(res);
        }
        catch {
            return 'Cannot stringify response';
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http.exception.filter.js.map