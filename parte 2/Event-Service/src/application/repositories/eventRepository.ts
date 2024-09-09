import { Event } from "../entities/event";
import { IPagination } from "./interface";

export abstract class AbstractEventRepository {
  abstract save(data: Event): Promise<void>;
  abstract findMany(data: IPagination): Promise<Event[]>;
  abstract updateById(data: {
    id: string;
    updateData: Partial<Event>;
  }): Promise<{ affectedRows: number }>;
  abstract softDeleteById(id: string): Promise<{ affectedRows: number }>;
}
