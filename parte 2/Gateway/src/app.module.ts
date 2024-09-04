import { Module } from '@nestjs/common';
import 'dotenv/config';
import { ClientController } from './controllers/client.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_SERVICE',
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [ClientController],
  providers: [],
})
export class AppModule {}
