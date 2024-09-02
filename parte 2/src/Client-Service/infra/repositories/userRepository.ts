import { AbstractUserRepository } from 'src/application/repositories/userRepository';
import { UserEntity } from '../entities/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/application/entities/User';
import { UserEntityMapper } from '../mappers/user';

@Injectable()
export class UserRepository implements AbstractUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private urlRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const userEntity = UserEntityMapper.toDatabase(user);

    await this.urlRepository.save(userEntity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.urlRepository.existsBy({ email });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.urlRepository.findOne({ where: { email } });

    if (!user) return null;

    return UserEntityMapper.toDomain(user);
  }
  async existsById(id: string): Promise<boolean> {
    return this.urlRepository.existsBy({ id });
  }
}
