import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
    private getStatusAndMessage;
    private extractMessage;
    private isCloudinaryError;
    private isHttpResponseWithMessage;
    private stringifyResponse;
}
