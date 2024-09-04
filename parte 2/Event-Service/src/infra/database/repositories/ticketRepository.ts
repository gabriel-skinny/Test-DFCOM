import { Model, Model as MongoModel } from 'mongoose';
import { Ticket } from '../../../application/entities/ticket';
import { AbstractTicketRepository } from '../../../application/repositories/ticketRepository';
import { TicketModel } from '../entities/ticket';
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

  async updateById({
    id,
    updateData,
  }: {
    id: string;
    updateData: Partial<Ticket>;
  }): Promise<void> {
    await this.ticketModel.updateOne({ id }, updateData);
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findById(id);

    if (!ticketModel) return null;

    return TicketMapper.toDomain(ticketModel);
  }

  async findTicketAvailableByEventId(eventId: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findOne({
      eventId,
    });

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
