import { Inject, Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../entities/status";
import { AbstractOderRepository } from "../repositories/orderRepository";
import { ClientKafka } from "@nestjs/microservices";

interface IUpdateOrderStatusUseCaseParams {
  newStatus: OrderStatusEnum;
  orderId: string;
}

@Injectable()
export default class UpdateOrderStatusUseCase {
  constructor(
    private orderRepository: AbstractOderRepository,
    @Inject("KAFKA_SERVICE")
    private kafkaService: ClientKafka
  ) {}

  async execute({
    newStatus,
    orderId,
  }: IUpdateOrderStatusUseCaseParams): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    order.status.changeStatus(newStatus);

    if (newStatus == OrderStatusEnum.PAYED) {
      this.kafkaService.emit("order-payed", {
        ticketId: order.ticketId,
        userId: order.userId,
      });
    }

    await this.orderRepository.save(order);
  }
}
