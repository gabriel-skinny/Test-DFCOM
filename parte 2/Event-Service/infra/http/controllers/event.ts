import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../guards/Autentication';
import { GetManyEventsUseCase } from 'Event-Service/application/use-cases/get-many-events';

@Controller('event')
export class EventController {
  constructor(
    private readonly getManyEventsUseCase: GetManyEventsUseCase,
    private readonly requestBuyOrderUseCase: RequestBuyOrderUseCaseCase,
  ) {}

  @Get('many')
  async getMany(
    @Query('perpage', new ParseIntPipe()) perPage: number,
    @Query('page', new ParseIntPipe()) page: number,
  ) {
    const events = await this.getManyEventsUseCase.execute({ page, perPage });

    return {
      statusCode: HttpStatus.OK,
      message: 'Events',
      data: { events },
    };
  }

  @Post('request-buy-order/:eventId')
  async requestBuyOrder(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Req() req: any,
  ) {
    const userId = req?.user?.userId || 'fakeUserId';

    await this.requestBuyOrderUseCase.execute({ eventId, userId });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Request to buy ticket send',
    };
  }
}
