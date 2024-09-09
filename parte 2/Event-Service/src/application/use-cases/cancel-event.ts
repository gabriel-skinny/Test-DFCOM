import { ClientKafka } from "@nestjs/microservices";
import { AbstractEventRepository } from "../repositories/eventRepository";
import { Inject } from "@nestjs/common";
import { NotFoundError } from "../errors/notFound";

interface ICancelEventUseCaseParams {
  eventId: string;
}

export class CancelEventUseCase {
  constructor(
    private eventRepository: AbstractEventRepository,
    @Inject("KAFKA_SERVICE")
    private kafkaService: ClientKafka
  ) {}

  async execute({ eventId }: ICancelEventUseCaseParams): Promise<void> {
    const { affectedRows } = await this.eventRepository.updateById({
      id: eventId,
      updateData: { available: false },
    });

    if (affectedRows == 0) throw new NotFoundError("Event to cancel not found");

    this.kafkaService.emit("event-canceled", { eventId });
  }
}
