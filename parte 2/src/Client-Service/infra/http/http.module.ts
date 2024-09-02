import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateUserUseCase } from 'src/Client-Service/application/use-cases/create';
import { LoginUseCase } from 'src/Client-Service/application/use-cases/login';
import { ServiceModule } from '../services/services.module';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [LoginUseCase, CreateUserUseCase],
  controllers: [UserController],
})
export class HttpModule {}
