import { OrderStatusEnum } from '../entities/status';
import { AbstractOderRepository } from '../repositories/orderRepository';

interface IUpdateOrderStatusUseCaseParams {
  newStatus: OrderStatusEnum;
  orderId: string;
}

export default class UpdateOrderStatusUseCase {
  constructor(private orderRepository: AbstractOderRepository) {}

  async execute({
    newStatus,
    orderId,
  }: IUpdateOrderStatusUseCaseParams): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    order.status.changeStatus(newStatus);

    await this.orderRepository.save(order);
  }
}
