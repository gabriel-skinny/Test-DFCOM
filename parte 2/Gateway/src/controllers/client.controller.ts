import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AbstractAuthService } from '../auth/Auth';
import { CreateUserDTO, LoginDTO } from 'src/dtos/user.dto';

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

@Controller('client')
export class ClientController {
  constructor(
    @Inject('CLIENT_SERVICE')
    private clientService: ClientProxy,
    private authService: AbstractAuthService,
  ) {}

  @Post()
  async create(
    @Body() { email, name, password }: CreateUserDTO,
  ): Promise<BaseControllerReturn> {
    this.clientService
      .send('create-user', {
        email,
        name,
        password,
      })
      .subscribe();

    return {
      message: 'User created succesfully',
      statusCode: HttpStatus.OK,
    };
  }

  @Post('/login')
  async login(
    @Body() { email, password }: LoginDTO,
  ): Promise<BaseControllerReturn<{ token: string }>> {
    const logInDataObervable =
      this.clientService.send<ILoginUserServiceReturnData>('login-user', {
        email,
        password,
      });

    let token: string;
    logInDataObervable.subscribe(async (data) => {
      if (!data) throw new InternalServerErrorException();

      const { token: tokenCreated } = await this.authService.generateLoginToken(
        {
          userId: data.userId,
          email: data.email,
          name: data.name,
        },
      );

      token = tokenCreated;
    });

    return {
      message: 'loged in succesfully',
      statusCode: HttpStatus.OK,
      data: { token },
    };
  }
}
