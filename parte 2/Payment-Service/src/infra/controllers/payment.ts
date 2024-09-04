import {
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreatePaymentUseCase } from 'src/application/use-cases/create';
import { WebhookPaymentConfirmation } from 'src/application/use-cases/webhook-payment-confirmation';
import { AuthGuard } from '../guards/Autentication';

@UseGuards(AuthGuard)
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

  @Post('webhook-payment-confirmation/:externalId')
  async webhookPaymentConfirmation(
    @Param('externalId', ParseUUIDPipe) externalId: string,
  ) {
    await this.webhookPaymentConfirmationUseCase.execute({
      externalId,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment confirmed',
    };
  }
}
