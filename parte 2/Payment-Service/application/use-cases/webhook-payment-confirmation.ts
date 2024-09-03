import { AbstractPaymentRepository } from '../repositories/paymentRepository';
import { AbstractKafkaService } from '../services/kafkaService';

interface IWebhookPaymentConfirmationParams {
  externalId: string;
}

export class WebhookPaymentConfirmation {
  constructor(
    private paymentRepository: AbstractPaymentRepository,
    private kakfaService: AbstractKafkaService,
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

    this.kakfaService.sendEvent({
      eventName: 'Payment',
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
      },
    });
  }
}
