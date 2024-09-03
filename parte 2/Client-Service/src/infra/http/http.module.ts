import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';

import { ServiceModule } from '../services/services.module';
import { DatabaseModule } from '../database/database.module';
import { LoginUseCase } from 'src/application/use-cases/login';
import { CreateUserUseCase } from 'src/application/use-cases/create';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [LoginUseCase, CreateUserUseCase],
  controllers: [UserController],
})
export class HttpModule {}
