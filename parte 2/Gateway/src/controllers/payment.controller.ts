import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../guards/Autentication';
import { ILoginTokenData } from 'src/auth/Auth';
import { BaseControllerReturn } from './interface';

interface IGetPaymentsByUserReturn {
  id: string;
  orderId: string;
  userId: string;
  status: string;
  value: number;
  webhookUrl: string;
  externalId: string;
  createdAt: Date;
  updatedAt?: Date;
}

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    @Inject('PAYMENT_SERVICE')
    private readonly paymentService: ClientProxy,
  ) {}

  @Post('webhook-payment-confirmation/:externalId')
  async webhookPaymentConfirmation(
    @Param('externalId', ParseUUIDPipe) externalId: string,
  ) {
    firstValueFrom(
      this.paymentService.send(
        { cmd: 'webhook-payment-confirmation' },
        { externalId },
      ),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Payment confirmed',
    };
  }

  @Get()
  async getManyByUser(
    @Req() { user }: { user: ILoginTokenData },
    @Query('perpage', new ParseIntPipe()) perPage: number,
    @Query('page', new ParseIntPipe()) page: number,
  ): Promise<BaseControllerReturn<{ payments: IGetPaymentsByUserReturn[] }>> {
    const { payments } = await firstValueFrom(
      this.paymentService.send<{ payments: IGetPaymentsByUserReturn[] }>(
        { cmd: 'get-many-by-user' },
        { userId: user.userId, perPage, page },
      ),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Orders from user',
      data: { payments },
    };
  }
}
