import { Controller, HttpStatus } from "@nestjs/common";
import { EventPattern, MessagePattern, Transport } from "@nestjs/microservices";
import { CreatePaymentUseCase } from "src/application/use-cases/create";
import { GetPaymentsByUserIdUseCase } from "src/application/use-cases/get-payments-by-user-id";
import { WebhookPaymentConfirmation } from "src/application/use-cases/webhook-payment-confirmation";
import {
  IPaymentViewModel,
  PaymentViewModel,
} from "../viewModel/payment-view-model";

interface ICreatePaymentParams {
  value: {
    orderId: string;
    userId: string;
    creditCardNumber: string;
    creditCardSecurityNumber: string;
    creditCardExpirationDate: string;
    value: number;
  };
}

@Controller()
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly webhookPaymentConfirmationUseCase: WebhookPaymentConfirmation,
    private readonly getPaymentsByUserIdUseCase: GetPaymentsByUserIdUseCase
  ) {}

  @EventPattern("create-payment")
  async create(data: ICreatePaymentParams): Promise<{ paymentId: string }> {
    console.log({ data });
    const { paymentId } = await this.createPaymentUseCase.execute(data.value);

    return { paymentId };
  }

  @MessagePattern({ cmd: "get-many-by-user" }, Transport.TCP)
  async getManyByUserId({
    userId,
    perPage,
    page,
  }: {
    userId: string;
    perPage: number;
    page: number;
  }): Promise<{ payments: IPaymentViewModel[] }> {
    const payments = await this.getPaymentsByUserIdUseCase.execute({
      userId,
      perPage,
      page,
    });

    return { payments: payments.map(PaymentViewModel.toHttp) };
  }

  @MessagePattern({ cmd: "webhook-payment-confirmation" }, Transport.TCP)
  async webhookPaymentConfirmation({ externalId }: { externalId: string }) {
    await this.webhookPaymentConfirmationUseCase.execute({
      externalId,
    });

    return {
      statusCode: HttpStatus.OK,
      message: "Payment confirmed",
    };
  }
}
