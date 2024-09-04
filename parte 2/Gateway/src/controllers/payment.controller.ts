import {
  Controller,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/Autentication';

@UseGuards(AuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentService: ClientProxy,
  ) {}

  @Post('webhook-payment-confirmation/:externalId')
  async webhookPaymentConfirmation(
    @Param('externalId', ParseUUIDPipe) externalId: string,
  ) {
    firstValueFrom(
      this.paymentService.send(
        { cmd: 'webhook-payment-confirmation' },
        { externalId },
      ),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment confirmed',
    };
  }
}
