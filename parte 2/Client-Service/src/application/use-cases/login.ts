import { Injectable } from '@nestjs/common';
import { NotFoundError } from '../errors/notFound';
import { WrongValueError } from '../errors/wrongValue';
import { AbstractUserRepository } from '../repositories/userRepository';

interface ILoginUseCaseParams {
  email: string;
  password: string;
}

interface ILoginUseCaseReturn {
  userId: string;
  name: string;
  email: string;
}

@Injectable()
export class LoginUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute({
    email,
    password,
  }: ILoginUseCaseParams): Promise<ILoginUseCaseReturn> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundError('User not found with that email');

    if (!user.password_hash.isTheSameValue(password))
      throw new WrongValueError('Password does not match');

    return { userId: user.id, email: user.email, name: user.name };
  }
}
