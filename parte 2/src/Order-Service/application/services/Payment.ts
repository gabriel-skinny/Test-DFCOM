export abstract class AbstractPaymentService {
  abstract createPayment(data: {
    orderId: string;
    userId: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
    value: number;
  }): Promise<{ paymentId: string }>;
}
