import { Injectable } from '@nestjs/common';
import { AbstractOderRepository } from '../repositories/orderRepository';

interface IGetOrdersByUserId {
  userId: string;
  page: number;
  perPage: number;
}

@Injectable()
export class GetOrdersByUserIdUseCase {
  constructor(private orderRepository: AbstractOderRepository) {}

  async execute({ userId, page, perPage }: IGetOrdersByUserId) {
    const orders = await this.orderRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
    });

    return orders;
  }
}
