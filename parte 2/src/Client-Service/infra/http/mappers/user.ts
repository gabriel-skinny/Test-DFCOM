import { User } from 'src/application/entities/User';
import { UserEntity } from '../entities/user';

export class UserEntityMapper {
  static toDatabase(user: User): UserEntity {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password_hash.value,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      updatedAt: user.updatedAt,
    };
  }

  static toDomain(user: UserEntity): User {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password_hash,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
    });
  }
}
