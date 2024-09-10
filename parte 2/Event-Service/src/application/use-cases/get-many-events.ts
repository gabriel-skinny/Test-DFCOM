import { Injectable } from "@nestjs/common";
import { Event } from "../entities/event";
import { AbstractEventRepository } from "../repositories/eventRepository";

interface IGetManyEventsParams {
  page: number;
  perPage: number;
  filters?: Partial<Event>;
}

type IGetManyEventsReturn = Array<Event>;

@Injectable()
export class GetManyEventsUseCase {
  constructor(private eventRepository: AbstractEventRepository) {}

  async execute({
    page,
    perPage,
    filters,
  }: IGetManyEventsParams): Promise<IGetManyEventsReturn> {
    return this.eventRepository.findMany({
      limit: perPage,
      skip: page * perPage - perPage,
      filters,
    });
  }
}
