import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { CreateUserUseCase } from 'Client-Service/src/application/use-cases/create';
import { LoginUseCase } from 'Client-Service/src/application/use-cases/login';
import { ServiceModule } from '../services/services.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [LoginUseCase, CreateUserUseCase],
  controllers: [UserController],
})
export class HttpModule {}
