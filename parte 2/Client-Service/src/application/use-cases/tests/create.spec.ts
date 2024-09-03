import { makeUser } from './factories/makeUser';

import { CreateUserUseCase } from '../create';
import { InMemoryUserRepository } from '../../repositories/inMemoryUserRepository';
import { AlreadyCreatedError } from '../../errors/alreadyCreated';

const makeSut = () => {
  const userRepository = new InMemoryUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);

  return { userRepository, createUserUseCase };
};

describe('Create user use case', () => {
  it('Should create a user', async () => {
    const { userRepository, createUserUseCase } = makeSut();

    const userData = {
      name: 'User',
      email: 'user@gmail.com',
      password: 'plain_password',
    };
    await createUserUseCase.execute(userData);

    expect(userRepository.userDatabase).toHaveLength(1);
    expect(userRepository.userDatabase[0].email).toBe(userData.email);
  });

  it('Should throw an alreadyExists error with a user already exists with that email', async () => {
    const { userRepository, createUserUseCase } = makeSut();

    const userCreated = makeUser();
    await userRepository.save(userCreated);

    const createUserUseCasePromise = createUserUseCase.execute({
      name: 'User',
      email: userCreated.email,
      password: 'plain_password',
    });

    expect(createUserUseCasePromise).rejects.toStrictEqual(
      new AlreadyCreatedError('User already created with that email'),
    );
  });
});
