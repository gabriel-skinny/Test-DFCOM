import { User } from '../../../application/entities/User';
import { UserModel } from '../entities/user';

export class UserMapper {
  static toDatabase(raw: User): UserModel {
    return {
      _id: raw.id,
      id: raw.id,
      email: raw.email,
      name: raw.name,
      password_hash: raw.password_hash.value,
      createdAt: raw.createdAt,
      deletedAt: raw.deletedAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toDomain(model: UserModel): User {
    return new User({
      id: model.id,
      email: model.email,
      name: model.name,
      password: model.password_hash,
      createdAt: model.createdAt,
      deletedAt: model.deletedAt,
      updatedAt: model.updatedAt,
    });
  }
}
