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

import { AuthGuard } from '../guards/Autentication';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ILoginTokenData } from 'src/auth/Auth';

interface IOrderTicketReturn {
  ticketId: string;
}

@UseGuards(AuthGuard)
@Controller('event')
export class EventController {
  constructor(
    @Inject('EVENT_SERVICE')
    private eventService: ClientProxy,
  ) {}

  @Get('many')
  async getMany(
    @Query('perpage', new ParseIntPipe()) perPage: number,
    @Query('page', new ParseIntPipe()) page: number,
  ) {
    const events = await firstValueFrom(
      this.eventService.send({ cmd: 'get-many-events' }, { page, perPage }),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Events',
      data: { events },
    };
  }

  @Post('order-ticket/:eventId')
  async orderTicket(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Req() req: { user: ILoginTokenData },
  ): Promise<BaseControllerReturn<{ ticketId: string }>> {
    const userId = req.user.userId;

    const { ticketId } = await firstValueFrom(
      this.eventService.send<IOrderTicketReturn>(
        { cmd: 'order-ticket' },
        { eventId, userId },
      ),
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create Order to ticket requested',
      data: { ticketId },
    };
  }
}
