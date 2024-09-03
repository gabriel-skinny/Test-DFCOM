import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AlreadyCreatedError } from 'Client-Service/src/application/errors/alreadyCreated';
import { NotFoundError } from 'Client-Service/src/application/errors/notFound';
import { WrongValueError } from 'Client-Service/src/application/errors/wrongValue';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    if (exception instanceof HttpException) status = exception.getStatus();
    if (exception instanceof NotFoundError) status = HttpStatus.NOT_FOUND;
    if (
      exception instanceof AlreadyCreatedError ||
      exception instanceof WrongValueError
    )
      status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
