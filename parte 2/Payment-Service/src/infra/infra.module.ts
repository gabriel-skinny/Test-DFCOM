import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ServiceModule } from './services/services.module';
import { PaymentController } from './controllers/payment';
import { CreatePaymentUseCase } from 'src/application/use-cases/create';
import { WebhookPaymentConfirmation } from 'src/application/use-cases/webhook-payment-confirmation';

@Module({
  imports: [DatabaseModule, ServiceModule],
  providers: [CreatePaymentUseCase, WebhookPaymentConfirmation],
  controllers: [PaymentController],
})
export class InfraModule {}
