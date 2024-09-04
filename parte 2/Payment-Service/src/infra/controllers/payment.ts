import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreatePaymentUseCase } from 'src/application/use-cases/create';
import { WebhookPaymentConfirmation } from 'src/application/use-cases/webhook-payment-confirmation';

interface ICreatePaymentParams {
  orderId: string;
  userId: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
  creditCardExpirationDate: string;
  value: number;
}

@Controller()
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly webhookPaymentConfirmationUseCase: WebhookPaymentConfirmation,
  ) {}

  @MessagePattern({ cmd: 'create-payment' })
  async create(data: ICreatePaymentParams): Promise<{ paymentId: string }> {
    const { paymentId } = await this.createPaymentUseCase.execute(data);

    return { paymentId };
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
