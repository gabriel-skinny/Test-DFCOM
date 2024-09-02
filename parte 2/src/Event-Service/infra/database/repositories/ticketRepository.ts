import { Model, Model as MongoModel } from 'mongoose';
import { Ticket } from 'src/Event-Service/application/entities/ticket';
import { AbstractTicketRepository } from 'src/Event-Service/application/repositories/ticketRepository';
import { TicketModel } from '../entitities/ticket';
import { TicketMapper } from '../mappers/ticket';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class TicketRepository implements AbstractTicketRepository {
  constructor(
    @InjectModel(TicketModel.name) private ticketModel: Model<TicketModel>,
  ) {}

  async save(ticket: Ticket): Promise<void> {
    const ticketModel = TicketMapper.toDatabase(ticket);

    await this.ticketModel.create(ticketModel);
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findById(id);

    if (!ticketModel) return null;

    return TicketMapper.toDomain(ticketModel);
  }

  async findTicketAvailableById(id: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findOne({
      isAvailable: true,
      id,
    });

    if (!ticketModel) return null;

    return TicketMapper.toDomain(ticketModel);
  }
}
