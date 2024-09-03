import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'Client-Service/src/application/entities/User';
import { AbstractUserRepository } from 'Client-Service/src/application/repositories/userRepository';
import { UserModel } from '../entities/user';
import { UserMapper } from '../mappers/user';

@Injectable()
export default class UserRepository implements AbstractUserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async save(user: User): Promise<void> {
    const userToSave = UserMapper.toDatabase(user);

    await this.userModel.create(userToSave);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!this.userModel.exists({ email });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userModel.findOne({ email });

    if (!userModel) return null;

    return UserMapper.toDomain(userModel);
  }

  async existsById(id: string): Promise<boolean> {
    return !!this.userModel.exists({ id });
  }
}
