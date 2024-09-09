import { NotFoundError } from "../errors/notFound";
import { AbstractEventRepository } from "../repositories/eventRepository";

interface IPublicEventUseCaseParams {
  eventId: string;
}

export class PublicEventUseCase {
  constructor(private readonly eventRepository: AbstractEventRepository) {}

  async execute({ eventId }: IPublicEventUseCaseParams) {
    const { affectedRows } = await this.eventRepository.updateById({
      id: eventId,
      updateData: {
        available: true,
      },
    });

    if (affectedRows == 0) throw new NotFoundError("Event to public not found");
  }
}
