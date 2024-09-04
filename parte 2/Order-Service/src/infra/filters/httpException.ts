import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AlreadyCreatedError } from '../../application/errors/alreadyCreated';
import { NotFoundError } from '../../application/errors/notFound';
import { WrongValueError } from '../../application/errors/wrongValue';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(
    exception: Error | HttpException,
    host: ArgumentsHost,
  ): Observable<any> {
    const message = exception.message;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof NotFoundError) status = HttpStatus.NOT_FOUND;
    if (
      exception instanceof AlreadyCreatedError ||
      exception instanceof WrongValueError
    )
      status = HttpStatus.BAD_REQUEST;

    return throwError(() => ({
      message: message,
      status,
    }));
  }
}
