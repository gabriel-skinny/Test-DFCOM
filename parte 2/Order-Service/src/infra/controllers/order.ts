import { Controller, HttpStatus } from '@nestjs/common';

import { MessagePattern, Transport } from '@nestjs/microservices';
import { OrderStatusEnum } from 'src/application/entities/status';
import { GetOrdersByUserIdUseCase } from 'src/application/use-cases/get-orders-by-user-id';
import MakePaymentUseCase from 'src/application/use-cases/make-payment';
import UpdateOrderStatusUseCase from 'src/application/use-cases/update-order-status';
import { IOrderViewModel, OrderViewModel } from '../view-models/order';

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
    private readonly getOrdersByUserIdUseCase: GetOrdersByUserIdUseCase,
  ) {}

  @MessagePattern({ cmd: 'make-payment' }, Transport.TCP)
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
    };
  }

  @MessagePattern({ cmd: 'get-many-by-user' }, Transport.TCP)
  async getOrdersByUserId({
    userId,
    page,
    perPage,
  }: {
    userId: string;
    perPage: number;
    page: number;
  }): Promise<{ orders: IOrderViewModel[] }> {
    const orders = await this.getOrdersByUserIdUseCase.execute({
      userId,
      page,
      perPage,
    });

    return {
      orders: orders.map(OrderViewModel.toHttp),
    };
  }

  async paymentConfirmation(orderId: string) {
    await this.updateStatusOrderUseCase.execute({
      newStatus: OrderStatusEnum.PAYED,
      orderId,
    });
  }
}
