import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Observable, throwError } from 'rxjs';
import { AlreadyCreatedError } from 'src/application/errors/alreadyCreated';
import { NotFoundError } from 'src/application/errors/notFound';
import { WrongValueError } from 'src/application/errors/wrongValue';

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
