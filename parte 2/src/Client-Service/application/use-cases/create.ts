import { Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/User';
import { AlreadyCreatedError } from 'src/application/errors/alreadyCreated';
import { AbstractUserRepository } from 'src/application/repositories/userRepository';

interface ICreateUserUseCaseParams {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute(data: ICreateUserUseCaseParams) {
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
  }
}
