import { Inject, Injectable } from "@nestjs/common";
import { AbstractPaymentRepository } from "../repositories/paymentRepository";
import { AbstractKafkaService } from "../services/kafkaService";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";

interface IWebhookPaymentConfirmationParams {
  externalId: string;
}

@Injectable()
export class WebhookPaymentConfirmation {
  constructor(
    private paymentRepository: AbstractPaymentRepository,
    @Inject("KAFKA_SERVICE")
    private kakfaService: ClientKafka
  ) {}

  async execute({
    externalId,
  }: IWebhookPaymentConfirmationParams): Promise<void> {
    const payment =
      await this.paymentRepository.findPendentByExternalId(externalId);

    if (!payment) {
      console.log("Webhook de pagamento não achou correspondente");
      return;
    }

    payment.pay();
    console.log({ payment });
    await this.paymentRepository.updateById({
      id: payment.id,
      data: { status: payment.status },
    });

    this.kakfaService.emit("payment-confirmed", {
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
    });
  }
}
