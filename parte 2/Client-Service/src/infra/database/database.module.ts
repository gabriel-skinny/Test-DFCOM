import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModel, UserSchema } from './entities/user';
import UserRepository from './repositories/userRepository';
import { AbstractUserRepository } from '../../application/repositories/userRepository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [AbstractUserRepository],
})
export class DatabaseModule {}
