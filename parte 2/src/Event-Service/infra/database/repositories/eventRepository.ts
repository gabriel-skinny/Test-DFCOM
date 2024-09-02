import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from 'src/Event-Service/application/entities/event';
import { AbstractEventRepository } from 'src/Event-Service/application/repositories/eventRepository';
import { EventModel } from '../entitities/event';
import { EventMapper } from '../mappers/event';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class EventRepository implements AbstractEventRepository {
  constructor(
    @InjectModel(EventModel.name) private eventModel: Model<EventModel>,
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
}
