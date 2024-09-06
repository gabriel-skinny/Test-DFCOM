import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';
import { PaymentController } from './controllers/payment';
import { CreatePaymentUseCase } from 'src/application/use-cases/create';
import { WebhookPaymentConfirmation } from 'src/application/use-cases/webhook-payment-confirmation';
import { GetPaymentsByUserIdUseCase } from 'src/application/use-cases/get-payments-by-user-id';
import {
  AbstractExternalPaymentProvider,
  ExternalPaymentProviderFake,
} from 'src/application/services/externalPaymentProvider';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment',
            brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
          },
          consumer: {
            groupId: 'payment-consumer',
          },
        },
      },
    ]),
    DatabaseModule,
    ServiceModule,
  ],
  providers: [
    CreatePaymentUseCase,
    WebhookPaymentConfirmation,
    GetPaymentsByUserIdUseCase,
    {
      provide: AbstractExternalPaymentProvider,
      useClass: ExternalPaymentProviderFake,
    },
  ],
  controllers: [PaymentController],
})
export class InfraModule {}
