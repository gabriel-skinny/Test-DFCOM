import { Module } from '@nestjs/common';
import 'dotenv/config';
import { ClientController } from './controllers/client.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceModule } from './auth/services.module';
import { EventController } from './controllers/event.controller';
import { OrderController } from './controllers/order.controller';

const services = [
  'CLIENT_SERVICE',
  'EVENT_SERVICE',
  'ORDER_SERVICE',
  'PAYMENT_SERVICE',
];

@Module({
  imports: [
    ClientsModule.register(
      services.map((serviceName) => ({
        name: serviceName,
        transport: Transport.TCP,
        options: {
          host: process.env[`${serviceName}_HOST`],
          port: Number(process.env[`${serviceName}_PORT`]),
        },
      })),
    ),
    ServiceModule,
  ],
  controllers: [ClientController, EventController, OrderController],
  providers: [],
})
export class AppModule {}
