export abstract class AbstractKafkaService {
  abstract sendEvent(data: { eventName: string; data: any }): Promise<void>;
}
