import { AbstractOderRepository } from '../repositories/orderRepository';

interface IGetOrdersByUserId {
  userId: string;
}

export class GetOrdersByUserIdUseCase {
  constructor(private orderRepository: AbstractOderRepository) {}

  async execute({ userId }: IGetOrdersByUserId) {
    const orders = await this.orderRepository.findManyByUserId(userId);

    return orders;
  }
}
