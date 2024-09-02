import { Injectable } from '@nestjs/common';
import { AbstractUserRepository } from 'src/application/repositories/userRepository';

export abstract class AbstractUserExistsByIdUseCase {
  abstract execute(userId: string): Promise<boolean>;
}

@Injectable()
export class UserExistsByIdUseCase implements AbstractUserExistsByIdUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute(userId: string): Promise<boolean> {
    return this.userRepository.existsById(userId);
  }
}
