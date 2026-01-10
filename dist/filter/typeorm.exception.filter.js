"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let TypeOrmExceptionFilter = class TypeOrmExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Database query failed';
        const driverError = exception.driverError;
        if (driverError) {
            switch (driverError.code) {
                case '23505':
                    status = common_1.HttpStatus.CONFLICT;
                    message = driverError.detail || 'Duplicate entry';
                    break;
                case '23503':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Invalid reference';
                    break;
                case '23502':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Missing required field';
                    break;
                case '22001':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Value too long for column';
                    break;
                case '22003':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Numeric value out of range';
                    break;
                case '22007':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Invalid datetime format';
                    break;
                case '22012':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Division by zero';
                    break;
                case '42601':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'SQL syntax error';
                    break;
                case '42P01':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Table not found';
                    break;
                case '42703':
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Column not found';
                    break;
                default:
                    status = common_1.HttpStatus.BAD_REQUEST;
                    message = driverError.detail || 'Database query failed';
            }
        }
        response.status(status).json({ status, message });
    }
};
exports.TypeOrmExceptionFilter = TypeOrmExceptionFilter;
exports.TypeOrmExceptionFilter = TypeOrmExceptionFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError)
], TypeOrmExceptionFilter);
//# sourceMappingURL=typeorm.exception.filter.js.map