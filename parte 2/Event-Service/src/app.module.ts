import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { DatabaseModule } from './infra/database/database.module';
import { InfraModule } from './infra/infra.module';
import { ServiceModule } from './infra/services/services.module';

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
    DatabaseModule,
    ServiceModule,
    InfraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
