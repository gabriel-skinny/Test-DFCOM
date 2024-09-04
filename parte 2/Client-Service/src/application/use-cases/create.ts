import { Injectable } from '@nestjs/common';
import { AlreadyCreatedError } from '../errors/alreadyCreated';
import { User } from '../entities/User';
import { AbstractUserRepository } from '../repositories/userRepository';

interface ICreateUserUseCaseParams {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute(data: ICreateUserUseCaseParams): Promise<User> {
    if (await this.userRepository.existsByEmail(data.email)) {
      throw new AlreadyCreatedError('User already created with that email');
    }

    const user = new User({
      email: data.email,
      name: data.name,
      password: data.password,
    });
    user.password_hash.hashPassword();

    await this.userRepository.save(user);

    return user;
  }
}
