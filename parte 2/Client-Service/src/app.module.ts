import { Module } from '@nestjs/common';
import { HttpModule } from './infra/http/http.module';
import { DatabaseModule } from './infra/database/database.module';
import { ServiceModule } from './infra/services/services.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { JwtModule } from '@nestjs/jwt';
import { InfraModule } from './infra/infra.module';

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
