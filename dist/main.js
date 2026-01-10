"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./filter/http.exception.filter");
const typeorm_exception_filter_1 = require("./filter/typeorm.exception.filter");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const allowedOrigins = configService
        .get('CORS_ORIGINS', '')
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0);
    const originChecker = (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, false);
            throw new common_1.ForbiddenException(`origin ${origin} not allowed`);
        }
    };
    app.enableCors({
        origin: originChecker,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(), new typeorm_exception_filter_1.TypeOrmExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const port = configService.get('PORT') || 3000;
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map