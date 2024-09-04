import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import ConfirmPaymentUseCase from 'src/application/use-cases/confirm-payment';
import { AuthGuard } from '../guards/Autentication';
import { ConfirmPaymentDTO } from '../dtos/order';
import { ILoginTokenData } from '../services/Auth';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order';
import UpdateOrderStatusUseCase from 'src/application/use-cases/update-order-status';
import { OrderStatusEnum } from 'src/application/entities/status';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly confirmPaymentUseCase: ConfirmPaymentUseCase,
    private readonly updateStatusOrderUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Post('confirm-payment/:orderId')
  async confirmPayment(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() paymentData: ConfirmPaymentDTO,
    @Req() { user }: { user: ILoginTokenData },
  ) {
    await this.confirmPaymentUseCase.execute({
      orderId,
      userId: user.userId,
      creditCardExpirationDate: paymentData.creditCardExpirationDate,
      creditCardNumber: paymentData.creditCardNumber,
      creditCardSecurityNumber: paymentData.creditCardSecurityNumber,
    });

    return {
      message: 'Payment sent',
      statusCode: HttpStatus.OK,
    };
  }

  async paymentConfirmation(orderId: string) {
    await this.updateStatusOrderUseCase.execute({
      newStatus: OrderStatusEnum.PAYED,
      orderId,
    });
  }
}
