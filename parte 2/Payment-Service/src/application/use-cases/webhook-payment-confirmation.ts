import { Inject, Injectable } from '@nestjs/common';
import { AbstractPaymentRepository } from '../repositories/paymentRepository';
import { AbstractKafkaService } from '../services/kafkaService';
import { ClientProxy } from '@nestjs/microservices';

interface IWebhookPaymentConfirmationParams {
  externalId: string;
}

@Injectable()
export class WebhookPaymentConfirmation {
  constructor(
    private paymentRepository: AbstractPaymentRepository,
    @Inject('KAFKA_CONSUMER')
    private kakfaService: ClientProxy,
  ) {}

  async execute({
    externalId,
  }: IWebhookPaymentConfirmationParams): Promise<void> {
    const payment =
      await this.paymentRepository.findPendentByExternalId(externalId);

    if (!payment) {
      console.log('Webhook de pagamento não achou correspondente');
      return;
    }

    payment.pay();
    await this.paymentRepository.save(payment);

    this.kakfaService.emit('payment-confirmed', {
      paymentId: payment.id,
      orderId: payment.orderId,
      userId: payment.userId,
    });
  }
}
