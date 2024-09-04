import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order';
import 'dotenv/config';

interface IOrderJobData {
  ticketId: string;
  ticketValue: number;
  userId: string;
}

@Processor(process.env.BULLMQ_QUEUE_NAME)
export class OrderConsumer extends WorkerHost {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {
    super();
  }

  async process(job: Job<IOrderJobData>): Promise<any> {
    console.log({ job });
    if (job.name == 'create-order') {
      await this.createOrderUseCase.execute({
        ticketId: job.data.ticketId,
        ticketValue: job.data.ticketValue,
        userId: job.data.userId,
      });
    }
  }
}
