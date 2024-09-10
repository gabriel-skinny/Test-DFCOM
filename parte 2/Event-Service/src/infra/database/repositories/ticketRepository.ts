import { Document, Model, Model as MongoModel } from "mongoose";
import { Ticket } from "../../../application/entities/ticket";
import { AbstractTicketRepository } from "../../../application/repositories/ticketRepository";
import { TicketModel } from "../entities/ticket";
import { TicketMapper } from "../mappers/ticket";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { IPagination } from "src/application/repositories/interface";

@Injectable()
export default class TicketRepository implements AbstractTicketRepository {
  constructor(
    @InjectModel(TicketModel.name) private ticketModel: Model<TicketModel>
  ) {}

  async save(ticket: Ticket): Promise<void> {
    const ticketModel = TicketMapper.toDatabase(ticket);

    await this.ticketModel.create(ticketModel);
  }

  async saveMany(tickets: Ticket[]): Promise<void> {
    const ticketsDocument = tickets.map(
      (ticket) => new Document(TicketMapper.toDatabase(ticket))
    );

    await this.ticketModel.bulkSave(ticketsDocument);
  }

  async updateById({
    id,
    updateData,
  }: {
    id: string;
    updateData: Partial<Ticket>;
  }): Promise<{ rowsAffected: number }> {
    const result = await this.ticketModel.updateOne({ id }, updateData);

    return { rowsAffected: result.modifiedCount };
  }

  async updateManyByEventIdAndType({
    eventId,
    type,
    updateData,
  }: {
    eventId: string;
    type: string;
    updateData: Partial<Ticket>;
  }): Promise<{ rowsAffected: number }> {
    const result = await this.ticketModel.updateOne(
      { eventId, type },
      updateData
    );

    return { rowsAffected: result.modifiedCount };
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findById(id);

    if (!ticketModel) return null;

    return TicketMapper.toDomain(ticketModel);
  }

  async findTicketAvailableByEventId(eventId: string): Promise<Ticket | null> {
    const ticketModel = await this.ticketModel.findOne({
      eventId,
      isAvailable: true,
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

  async findManyByBuyerId({
    buyerId,
    limit,
    skip,
  }: { buyerId: string } & IPagination): Promise<{
    tickets: Ticket[];
    totalCount: number;
  }> {
    const filterQuery: Partial<Ticket> = {
      buyerId,
    };

    const countedTotalDocuments =
      await this.ticketModel.countDocuments(filterQuery);
    const ticketsModel = await this.ticketModel
      .find(filterQuery)
      .limit(limit)
      .skip(skip);

    if (!ticketsModel)
      return {
        tickets: [],
        totalCount: countedTotalDocuments,
      };

    return {
      tickets: ticketsModel.map(TicketMapper.toDomain),
      totalCount: countedTotalDocuments,
    };
  }

  async ticketExistsByEventIdAndType({
    eventId,
    type,
  }: {
    type: string;
    eventId: string;
  }): Promise<{ id: string } | null> {
    const result = await this.ticketModel.exists({ type, eventId });

    return { id: result._id };
  }
}
