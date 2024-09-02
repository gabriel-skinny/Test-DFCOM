import { OrderStatusEnum } from '../entities/status';
import { AbstractOderRepository } from '../repositories/orderRepository';
import { AbstractPaymentService } from '../services/Payment';

interface IUpdateOrderStatusUseCaseParams {
  orderId: string;
  userId: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
  creditCardExpirationDate: string;
}

export default class ConfirmPaymentUseCase {
  constructor(
    private orderRepository: AbstractOderRepository,
    private paymentService: AbstractPaymentService,
  ) {}

  async execute({
    orderId,
    userId,
    creditCardExpirationDate,
    creditCardNumber,
    creditCardSecurityNumber,
  }: IUpdateOrderStatusUseCaseParams): Promise<void> {
    const pendentOrder = await this.orderRepository.findByStatusAndIdAndUserId({
      id: orderId,
      userId,
      status: OrderStatusEnum.ON_PAYMENT,
    });

    if (!pendentOrder) throw new Error('Order already payed or canceled');

    await this.paymentService.createPayment({
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
      orderId,
      userId,
      value: pendentOrder.value,
    });
  }
}
