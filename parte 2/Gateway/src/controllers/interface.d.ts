export interface BaseControllerReturn<T = void> {
  message: string;
  data?: T;
  statusCode: HttpStatus;
}
