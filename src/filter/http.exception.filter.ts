import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const res = exception.getResponse();

        const message = (() => {
            if (typeof res === 'string') return res;
            if (res && typeof res === 'object') {
                const msg = (res as { message?: string | string[] }).message;
                return Array.isArray(msg) ? msg.join(', ') : typeof msg === 'string' ? msg : JSON.stringify(res);
            }
            return String(res);
        })();

        response.status(status).json({ status, message });
    }
}
