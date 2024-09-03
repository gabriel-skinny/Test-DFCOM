export abstract class AbstractExternalPaymentProvider {
  abstract makePayment(data: {
    webhookUrl: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
  }): Promise<{ id: string }>;
}
