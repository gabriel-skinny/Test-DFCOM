import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePaymentUseCase } from 'src/application/use-cases/create';
import { WebhookPaymentConfirmation } from 'src/application/use-cases/webhook-payment-confirmation';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly webhookPaymentConfirmationUseCase: WebhookPaymentConfirmation,
  ) {}

  async create(data: {
    orderId: string;
    userId: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
    value: number;
  }) {
    await this.createPaymentUseCase.execute(data);
  }

  @MessagePattern({ cmd: 'webhook-payment-confirmation' })
  async webhookPaymentConfirmation({ externalId }: { externalId: string }) {
    await this.webhookPaymentConfirmationUseCase.execute({
      externalId,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment confirmed',
    };
  }
}
