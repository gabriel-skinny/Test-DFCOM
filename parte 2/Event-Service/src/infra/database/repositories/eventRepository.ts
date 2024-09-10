import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "../../../application/entities/event";
import { AbstractEventRepository } from "../../../application/repositories/eventRepository";
import { EventModel } from "../entities/event";
import { EventMapper } from "../mappers/event";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class EventRepository implements AbstractEventRepository {
  constructor(
    @InjectModel(EventModel.name) private eventModel: Model<EventModel>
  ) {}
  async findMany({
    limit,
    skip,
  }: {
    limit: number;
    skip: number;
  }): Promise<Event[]> {
    const eventModels = await this.eventModel.find().limit(limit).skip(skip);

    if (!eventModels) return [];

    return eventModels.map(EventMapper.toDomain);
  }

  async save(rawEvent: Event): Promise<void> {
    const eventModel = EventMapper.toDatabase(rawEvent);

    await this.eventModel.create(eventModel);
  }

  async updateById({
    id,
    updateData,
  }: {
    id: string;
    updateData: Partial<Event>;
  }): Promise<{ affectedRows: number }> {
    const result = await this.eventModel.updateOne({ id }, updateData);

    return { affectedRows: result.modifiedCount };
  }

  async softDeleteById(id: string): Promise<{ affectedRows: number }> {
    const result = await this.eventModel.updateOne(
      { id },
      { deletedAt: new Date() }
    );

    return { affectedRows: result.modifiedCount };
  }
}
