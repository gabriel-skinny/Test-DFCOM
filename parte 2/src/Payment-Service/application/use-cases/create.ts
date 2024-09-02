import { Payment } from '../entities/payment';
import { AbstractPaymentRepository } from '../repositories/paymentRepository';
import { AbstractExternalPaymentProvider } from '../services/externalPaymentProvider';

interface IPaymentUseCaseParams {
  orderId: string;
  userId: string;
  creditCardNumber: string;
  creditCardSecurityNumber: string;
  creditCardExpirationDate: string;
  value: number;
}

interface IPaymentUseCaseReturn {
  paymentId: string;
}

export class PaymentUseCase {
  constructor(
    private externalPaymentProvider: AbstractExternalPaymentProvider,
    private paymentRepository: AbstractPaymentRepository,
  ) {}

  async execute({
    creditCardNumber,
    creditCardExpirationDate,
    orderId,
    creditCardSecurityNumber,
    userId,
    value,
  }: IPaymentUseCaseParams): Promise<IPaymentUseCaseReturn> {
    const payment = new Payment({
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
      orderId,
      userId,
      value,
    });

    const paymentCreated = await this.externalPaymentProvider.makePayment({
      creditCardExpirationDate,
      creditCardNumber,
      creditCardSecurityNumber,
      webhookUrl: payment.webhookUrl,
    });

    payment.externalId = paymentCreated.id;

    await this.paymentRepository.save(payment);

    return { paymentId: payment.id };
  }
}
