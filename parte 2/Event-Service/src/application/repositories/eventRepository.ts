import { Event } from '../entities/event';

export abstract class AbstractEventRepository {
  abstract findMany(data: { limit: number; skip: number }): Promise<Event[]>;
}
