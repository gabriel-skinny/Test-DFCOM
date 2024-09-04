import { Module } from '@nestjs/common';
import InfraModule from './infra/infra.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from './infra/database/database.module';
import { ServiceModule } from './infra/services/services.module';
import 'dotenv/config';

const mongoUrl = `mongodb://${process.env.MONGO_DB_HOST}:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DB_NAME}?authSource=admin`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    InfraModule,
    DatabaseModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
