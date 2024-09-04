import { Controller, HttpStatus } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { OrderStatusEnum } from 'src/application/entities/status';
import MakePaymentUseCase from 'src/application/use-cases/make-payment';
import UpdateOrderStatusUseCase from 'src/application/use-cases/update-order-status';

interface IMakePaymentParams {
  orderId: string;
  userId: string;
  creditCardExpirationDate: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
}

@Controller()
export class OrderController {
  constructor(
    private readonly makePaymentUseCase: MakePaymentUseCase,
    private readonly updateStatusOrderUseCase: UpdateOrderStatusUseCase,
  ) {}

  @MessagePattern({ cmd: 'make-payment' })
  async makePayment({
    userId,
    orderId,
    creditCardExpirationDate,
    creditCardNumber,
    creditCardSecurityNumber,
  }: IMakePaymentParams) {
    await this.makePaymentUseCase.execute({
      orderId,
      userId,
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
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
