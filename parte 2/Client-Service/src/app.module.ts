import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { DatabaseModule } from './infra/database/database.module';
import { InfraModule } from './infra/infra.module';
import { ServiceModule } from './infra/services/services.module';

const mongoUrl = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DB_NAME}?authSource=admin`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    InfraModule,
    DatabaseModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
