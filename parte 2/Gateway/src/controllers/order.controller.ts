import {
  Body,
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
import { ILoginTokenData } from 'src/auth/Auth';
import { ConfirmPaymentDTO } from 'src/dtos/order';
import { AuthGuard } from 'src/guards/Autentication';
import { BaseControllerReturn } from './interface';

interface IGetOrdersByUserReturn {
  id: string;
  status: string;
  expireTime: Date;
  value: number;
  ticketId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(
    @Inject('ORDER_SERVICE')
    private orderService: ClientProxy,
  ) {}

  @Post('make-payment/:orderId')
  async makePayment(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() paymentData: ConfirmPaymentDTO,
    @Req() { user }: { user: ILoginTokenData },
  ) {
    await firstValueFrom(
      this.orderService.send(
        { cmd: 'make-payment' },
        {
          orderId,
          userId: user.userId,
          creditCardExpirationDate: paymentData.creditCardExpirationDate,
          creditCardNumber: paymentData.creditCardNumber,
          creditCardSecurityNumber: paymentData.creditCardSecurityNumber,
        },
      ),
    );

    return {
      message: 'Payment sent',
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  async getManyByUser(
    @Req() { user }: { user: ILoginTokenData },
    @Query('perpage', new ParseIntPipe()) perPage: number,
    @Query('page', new ParseIntPipe()) page: number,
  ): Promise<BaseControllerReturn<{ orders: IGetOrdersByUserReturn[] }>> {
    const data = await firstValueFrom(
      this.orderService.send<{ orders: IGetOrdersByUserReturn[] }>(
        { cmd: 'get-many-by-user' },
        { userId: user.userId, perPage, page },
      ),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Orders from user',
      data: { orders: data.orders },
    };
  }
}
