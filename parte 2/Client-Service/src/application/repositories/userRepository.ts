import { User } from '../entities/User';

export abstract class AbstractUserRepository {
  abstract save(user: User): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract existsById(userId: string): Promise<boolean>;
}
