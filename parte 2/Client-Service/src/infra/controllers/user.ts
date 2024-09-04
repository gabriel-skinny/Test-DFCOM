import { Controller, HttpStatus } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { CreateUserUseCase } from 'src/application/use-cases/create';
import { LoginUseCase } from 'src/application/use-cases/login';

interface BaseControllerReturn<T = void> {
  message: string;
  data?: T;
  statusCode: HttpStatus;
}

interface ILoginUserServiceReturnData {
  userId: string;
  email: string;
  name: string;
}

interface ICreateUserParams {
  email: string;
  name: string;
  password: string;
}

interface ILoginParams {
  email: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private loginUseCase: LoginUseCase,
  ) {}

  @MessagePattern({ cmd: 'user-create' })
  async create({
    email,
    name,
    password,
  }: ICreateUserParams): Promise<BaseControllerReturn> {
    await this.createUserUseCase.execute({
      email,
      name,
      password,
    });

    return {
      message: 'User created succesfully',
      statusCode: HttpStatus.OK,
    };
  }

  @MessagePattern({ cmd: 'user-login' })
  async login({
    email,
    password,
  }: ILoginParams): Promise<BaseControllerReturn<ILoginUserServiceReturnData>> {
    const data = await this.loginUseCase.execute({
      email,
      password,
    });

    return {
      message: 'loged in succesfully',
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
