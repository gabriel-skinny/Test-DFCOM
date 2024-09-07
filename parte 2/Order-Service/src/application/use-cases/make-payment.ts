import { Inject, Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../entities/status";
import { AbstractOderRepository } from "../repositories/orderRepository";
import { AbstractPaymentService } from "../services/Payment";
import { WrongValueError } from "../errors/wrongValue";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";

interface IUpdateOrderStatusUseCaseParams {
  orderId: string;
  userId: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
  creditCardExpirationDate: string;
}

@Injectable()
export default class MakePaymentUseCase {
  constructor(
    private orderRepository: AbstractOderRepository,
    @Inject("KAFKA_SERVICE")
    private kafkaService: ClientKafka
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

    if (!pendentOrder)
      throw new WrongValueError("Order already payed or canceled");

    const createPaymentData = {
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
      orderId,
      userId,
      valueNumber: pendentOrder.value,
    };

    this.kafkaService.emit("create-payment-new", createPaymentData);
  }
}
