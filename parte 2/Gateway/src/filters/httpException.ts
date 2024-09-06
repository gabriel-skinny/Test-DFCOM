import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { NotFoundError } from "rxjs";
import { AlreadyCreatedError } from "src/errors/alreadyCreated";
import { WrongValueError } from "src/errors/wrongValue";

type ICustomError = Error & {
  message: string;
  status: HttpStatus;
};

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: ICustomError | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      !(exception instanceof HttpException) &&
      Number.isInteger(exception?.status)
    )
      status = exception?.status;

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
