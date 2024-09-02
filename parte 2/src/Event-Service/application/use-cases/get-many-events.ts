import { Event } from '../entities/event';
import { AbstractEventRepository } from '../repositories/eventRepository';

interface IGetManyEventsParams {
  page: number;
  perPage: number;
}

type IGetManyEventsReturn = Array<Event>;

export class GetManyEventsUseCase {
  constructor(private eventRepository: AbstractEventRepository) {}

  async execute({
    page,
    perPage,
  }: IGetManyEventsParams): Promise<IGetManyEventsReturn> {
    return this.eventRepository.findMany({
      limit: perPage,
      skip: page * perPage - perPage,
    });
  }
}
